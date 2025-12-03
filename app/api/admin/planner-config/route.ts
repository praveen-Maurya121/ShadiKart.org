import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const configs = await prisma.plannerConfig.findMany({
      orderBy: { key: 'asc' },
    })

    return NextResponse.json(configs)
  } catch (error) {
    console.error('Error fetching planner configs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

