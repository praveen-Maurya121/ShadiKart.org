import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { randomBytes } from 'crypto'

const createGuestSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser('CUSTOMER')

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    })

    if (!booking || booking.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const guests = await prisma.guest.findMany({
      where: { bookingId: params.id },
      orderBy: { createdAt: 'desc' },
    })

    // Add inviteUrl to each guest
    const guestsWithUrl = guests.map(guest => ({
      ...guest,
      inviteUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/invite/${guest.inviteToken}`,
    }))

    return NextResponse.json(guestsWithUrl)
  } catch (error) {
    console.error('Error fetching guests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser('CUSTOMER')

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    })

    if (!booking || booking.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const data = createGuestSchema.parse(body)

    // Generate unique invite token
    const inviteToken = randomBytes(32).toString('hex')

    const guest = await prisma.guest.create({
      data: {
        bookingId: params.id,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        inviteToken,
        status: 'INVITED',
      },
    })

    // Return guest with inviteUrl
    return NextResponse.json({
      ...guest,
      inviteUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/invite/${inviteToken}`,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating guest:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

