import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateAddOnsSchema = z.object({
  addOnIds: z.array(z.string()),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { addOns: true },
    })

    if (!booking || booking.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { addOnIds } = updateAddOnsSchema.parse(body)

    // Delete existing add-ons
    await prisma.bookingAddOn.deleteMany({
      where: { bookingId: params.id },
    })

    // Get add-on details and calculate prices
    const addOns = await prisma.addOn.findMany({
      where: { id: { in: addOnIds }, isActive: true },
    })

    // Calculate add-on prices
    const bookingAddOns = await Promise.all(
      addOns.map(async (addOn) => {
        let price = addOn.basePrice
        if (addOn.priceType === 'PER_GUEST') {
          price = addOn.basePrice * booking.guestCount
        }

        return {
          bookingId: params.id,
          addOnId: addOn.id,
          quantity: 1,
          price,
        }
      })
    )

    // Create new add-ons
    if (bookingAddOns.length > 0) {
      await prisma.bookingAddOn.createMany({
        data: bookingAddOns,
      })
    }

    // Recalculate total price
    const preset = await prisma.packagePreset.findUnique({
      where: { id: booking.packagePresetId || '' },
    })

    const basePrice = preset?.basePrice || 0
    const addOnTotal = bookingAddOns.reduce((sum, bao) => sum + bao.price, 0)
    const totalPrice = basePrice + addOnTotal

    // Update booking
    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: { totalPrice },
      include: {
        addOns: {
          include: { addOn: true },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating add-ons:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

