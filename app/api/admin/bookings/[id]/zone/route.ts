import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const assignZoneSchema = z.object({
  zoneId: z.string(),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await req.json()
    const { zoneId } = assignZoneSchema.parse(body)

    // Check if zone exists
    const zone = await prisma.zone.findUnique({
      where: { id: zoneId },
    })

    if (!zone) {
      return NextResponse.json(
        { error: 'Zone not found' },
        { status: 404 }
      )
    }

    // Delete existing assignments
    await prisma.zoneAssignment.deleteMany({
      where: { bookingId: params.id },
    })

    // Create new assignment
    const assignment = await prisma.zoneAssignment.create({
      data: {
        bookingId: params.id,
        zoneId,
        status: 'ASSIGNED',
      },
    })

    return NextResponse.json(assignment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error assigning zone:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

