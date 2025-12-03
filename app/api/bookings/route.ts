import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createBookingSchema = z.object({
  packageCategoryId: z.string(),
  packagePresetId: z.string().optional().nullable(),
  cityId: z.string(),
  eventDate: z.string().transform(str => new Date(str)),
  guestCount: z.number().int().min(1),
  totalPrice: z.number().min(0),
  aiRecommendationSummary: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser('CUSTOMER')

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        packageCategory: true,
        city: true,
        packagePreset: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser('CUSTOMER')

    const body = await req.json()
    const data = createBookingSchema.parse(body)

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        packageCategoryId: data.packageCategoryId,
        packagePresetId: data.packagePresetId || null,
        cityId: data.cityId,
        eventDate: data.eventDate,
        guestCount: data.guestCount,
        totalPrice: data.totalPrice,
        aiRecommendationSummary: data.aiRecommendationSummary,
        status: 'DRAFT',
        currentStage: 'PLANNING',
      },
      include: {
        packageCategory: true,
        city: true,
        packagePreset: true,
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

