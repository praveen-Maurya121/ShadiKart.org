import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createPresetSchema = z.object({
  cityType: z.enum(['METRO', 'TIER2', 'TIER3']),
  basePrice: z.number().min(0),
  includedServices: z.string(), // JSON string
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const presets = await prisma.packagePreset.findMany({
      where: { packageCategoryId: params.id },
      orderBy: { cityType: 'asc' },
    })

    return NextResponse.json(presets)
  } catch (error) {
    console.error('Error fetching presets:', error)
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
    await requireAdmin()

    const body = await req.json()
    const data = createPresetSchema.parse(body)

    const preset = await prisma.packagePreset.create({
      data: {
        packageCategoryId: params.id,
        cityType: data.cityType,
        basePrice: data.basePrice,
        includedServices: data.includedServices,
      },
    })

    return NextResponse.json(preset, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating preset:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

