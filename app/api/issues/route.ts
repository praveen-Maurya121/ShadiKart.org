import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createIssueSchema = z.object({
  bookingId: z.string(),
  title: z.string().min(5),
  description: z.string().min(10),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser('CUSTOMER')

    const body = await req.json()
    const data = createIssueSchema.parse(body)

    // Verify booking belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    })

    if (!booking || booking.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const issue = await prisma.issue.create({
      data: {
        bookingId: data.bookingId,
        userId: user.id,
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        status: 'OPEN',
        zoneManagerId: null,
      },
    })

    return NextResponse.json(issue, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating issue:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

