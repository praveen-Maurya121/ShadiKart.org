import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createRatingSchema = z.object({
  bookingId: z.string(),
  overallScore: z.number().int().min(1).max(5),
  foodScore: z.number().int().min(1).max(5).optional(),
  decorScore: z.number().int().min(1).max(5).optional(),
  experienceScore: z.number().int().min(1).max(5).optional(),
  comments: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser('CUSTOMER')

    const body = await req.json()
    const data = createRatingSchema.parse(body)

    // Verify booking belongs to user and is completed
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    })

    if (!booking || booking.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Can only rate completed bookings' },
        { status: 400 }
      )
    }

    // Check if rating already exists
    const existing = await prisma.rating.findUnique({
      where: { bookingId: data.bookingId },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Rating already exists' },
        { status: 400 }
      )
    }

    const rating = await prisma.rating.create({
      data: {
        bookingId: data.bookingId,
        userId: user.id,
        overallScore: data.overallScore,
        foodScore: data.foodScore,
        decorScore: data.decorScore,
        experienceScore: data.experienceScore,
        comments: data.comments,
      },
    })

    return NextResponse.json(rating, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating rating:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

