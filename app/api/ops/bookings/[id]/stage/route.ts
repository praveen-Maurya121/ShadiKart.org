import { NextRequest, NextResponse } from 'next/server'
import { requireZoneManager } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateStageSchema = z.object({
  currentStage: z.enum(['PLANNING', 'PRE_EVENT', 'EVENT_DAY', 'POST_EVENT', 'COMPLETED']),
})

export async function PUT(
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
    const { currentStage } = updateStageSchema.parse(body)

    // If stage is COMPLETED and status is IN_PROGRESS, also update status
    const updateData: any = { currentStage }
    if (currentStage === 'COMPLETED' && booking.status === 'IN_PROGRESS') {
      updateData.status = 'COMPLETED'
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating booking stage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

