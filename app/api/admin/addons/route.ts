import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createAddonSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  priceType: z.enum(['PER_EVENT', 'FIXED', 'PER_GUEST']),
  basePrice: z.number().min(0),
  isActive: z.boolean().default(true),
})

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()

    const body = await req.json()
    const data = createAddonSchema.parse(body)

    const addon = await prisma.addOn.create({
      data,
    })

    return NextResponse.json(addon, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating add-on:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const addons = await prisma.addOn.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(addons)
  } catch (error) {
    console.error('Error fetching add-ons:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

