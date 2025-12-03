import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateAddonSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  priceType: z.enum(['PER_EVENT', 'FIXED', 'PER_GUEST']).optional(),
  basePrice: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const addon = await prisma.addOn.findUnique({
      where: { id: params.id },
    })

    if (!addon) {
      return NextResponse.json({ error: 'Add-on not found' }, { status: 404 })
    }

    return NextResponse.json(addon)
  } catch (error) {
    console.error('Error fetching add-on:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await req.json()
    const data = updateAddonSchema.parse(body)

    const addon = await prisma.addOn.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json(addon)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating add-on:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    await prisma.addOn.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting add-on:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

