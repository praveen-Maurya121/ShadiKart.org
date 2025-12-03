import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const assignZoneManagerSchema = z.object({
  userId: z.string(),
  zoneId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()

    const body = await req.json()
    const data = assignZoneManagerSchema.parse(body)

    // Check if user exists and is a zone manager
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    })

    if (!user || user.role !== 'ZONE_MANAGER') {
      return NextResponse.json(
        { error: 'User must be a zone manager' },
        { status: 400 }
      )
    }

    // Check if zone exists
    const zone = await prisma.zone.findUnique({
      where: { id: data.zoneId },
    })

    if (!zone) {
      return NextResponse.json({ error: 'Zone not found' }, { status: 404 })
    }

    // Create or update zone manager profile
    const profile = await prisma.zoneManagerProfile.upsert({
      where: { userId: data.userId },
      update: { zoneId: data.zoneId },
      create: {
        userId: data.userId,
        zoneId: data.zoneId,
      },
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error assigning zone manager:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

