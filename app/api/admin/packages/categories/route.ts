import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createCategorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  basePriceMetro: z.number().min(0),
  basePriceTier2: z.number().min(0),
  basePriceTier3: z.number().min(0),
  defaultGuestRangeMin: z.number().int().min(1),
  defaultGuestRangeMax: z.number().int().min(1),
})

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()

    const body = await req.json()
    const data = createCategorySchema.parse(body)

    const category = await prisma.packageCategory.create({
      data,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating package category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

