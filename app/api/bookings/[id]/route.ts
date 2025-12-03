import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser()

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        packageCategory: true,
        packagePreset: true,
        city: true,
        addOns: {
          include: { addOn: true },
        },
        guests: true,
        liveStreams: true,
        mediaAssets: true,
        zoneAssignments: {
          include: { zone: true },
        },
        ratings: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Customer can only see their own bookings
    // Admin and Zone Manager can see bookings in their scope
    if (user.role === 'CUSTOMER' && booking.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

