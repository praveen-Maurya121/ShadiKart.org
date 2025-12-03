import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser('CUSTOMER')

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    if (booking.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Only allow payment if status is DRAFT or PENDING_PAYMENT
    if (booking.status !== 'DRAFT' && booking.status !== 'PENDING_PAYMENT') {
      return NextResponse.json(
        { error: 'Booking cannot be paid in current status' },
        { status: 400 }
      )
    }

    // Simulate payment processing
    // In production, integrate with Razorpay/Stripe/UPI gateway here

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CONFIRMED',
        currentStage: 'PLANNING',
      },
      include: {
        packageCategory: true,
        city: true,
      },
    })

    return NextResponse.json({
      success: true,
      booking: updated,
      message: 'Payment processed successfully',
    })
  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

