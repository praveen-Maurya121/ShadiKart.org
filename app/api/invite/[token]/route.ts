import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateRSVPSchema = z.object({
  status: z.enum(['CONFIRMED', 'DECLINED']),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const guest = await prisma.guest.findUnique({
      where: { inviteToken: params.token },
      include: {
        booking: {
          include: {
            city: true,
            packageCategory: true,
          },
        },
      },
    })

    if (!guest) {
      return NextResponse.json(
        { error: 'Invalid invite token' },
        { status: 404 }
      )
    }

    return NextResponse.json(guest)
  } catch (error) {
    console.error('Error fetching invite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const body = await req.json()
    const { status } = updateRSVPSchema.parse(body)

    const guest = await prisma.guest.findUnique({
      where: { inviteToken: params.token },
    })

    if (!guest) {
      return NextResponse.json(
        { error: 'Invalid invite token' },
        { status: 404 }
      )
    }

    const updated = await prisma.guest.update({
      where: { id: guest.id },
      data: { status },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating RSVP:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

