import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { planWedding } from '@/lib/planner'
import { prisma } from '@/lib/db'

const plannerSchema = z.object({
  cityId: z.string(),
  guestCount: z.number().int().min(1),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(0),
  eventDate: z.string().transform(str => new Date(str)),
  preference: z.enum(['TRADITIONAL', 'TRENDY', 'FUSION', 'MINIMAL']),
  packageCategoryId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = plannerSchema.parse(body)

    // Get city to determine cityType
    const city = await prisma.city.findUnique({
      where: { id: data.cityId },
    })

    if (!city) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
    }

    const result = await planWedding({
      cityId: data.cityId,
      cityType: city.type as 'METRO' | 'TIER2' | 'TIER3',
      guestCount: data.guestCount,
      budgetMin: data.budgetMin,
      budgetMax: data.budgetMax,
      eventDate: data.eventDate,
      preference: data.preference,
    })

    // Get additional info for response
    const category = await prisma.packageCategory.findUnique({
      where: { id: result.packageCategoryId },
    })

    const preset = result.packagePresetId
      ? await prisma.packagePreset.findUnique({
          where: { id: result.packagePresetId },
        })
      : null

    const addOns = await prisma.addOn.findMany({
      where: { id: { in: result.suggestedAddOnIds } },
    })

    return NextResponse.json({
      ...result,
      categoryName: category?.name,
      presetIncludedServices: preset?.includedServices
        ? (typeof preset.includedServices === 'string'
            ? JSON.parse(preset.includedServices)
            : preset.includedServices)
        : null,
      suggestedAddOns: addOns,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error in planner:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

