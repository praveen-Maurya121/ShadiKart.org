import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateConfigSchema = z.object({
  value: z.string(),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    await requireAdmin()

    const body = await req.json()
    const { value } = updateConfigSchema.parse(body)

    const config = await prisma.plannerConfig.upsert({
      where: { key: params.key },
      update: { value },
      create: {
        key: params.key,
        value,
        scope: 'GLOBAL',
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating planner config:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

