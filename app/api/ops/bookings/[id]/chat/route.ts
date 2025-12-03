import { NextRequest, NextResponse } from 'next/server'
import { requireZoneManager } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const sendMessageSchema = z.object({
  message: z.string().min(1),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireZoneManager()

    const zoneManager = await prisma.zoneManagerProfile.findUnique({
      where: { userId: user.id },
    })

    if (!zoneManager) {
      return NextResponse.json({ error: 'Zone manager not found' }, { status: 404 })
    }

    // Verify booking is in their zone
    const booking = await prisma.booking.findFirst({
      where: {
        id: params.id,
        zoneAssignments: {
          some: {
            zoneId: zoneManager.zoneId,
          },
        },
      },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found or not in your zone' }, { status: 403 })
    }

    const body = await req.json()
    const { message } = sendMessageSchema.parse(body)

    const chatMessage = await prisma.chatMessage.create({
      data: {
        bookingId: params.id,
        senderId: user.id,
        senderType: 'ZONE_MANAGER',
        message,
      },
    })

    return NextResponse.json(chatMessage, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

