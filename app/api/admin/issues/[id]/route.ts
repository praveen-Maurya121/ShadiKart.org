import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateIssueSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  zoneManagerId: z.string().optional().nullable(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const issue = await prisma.issue.findUnique({
      where: { id: params.id },
      include: {
        booking: {
          include: {
            user: true,
            city: true,
          },
        },
        reporter: true,
        assignee: true,
      },
    })

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
    }

    return NextResponse.json(issue)
  } catch (error) {
    console.error('Error fetching issue:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await req.json()
    const data = updateIssueSchema.parse(body)

    const updateData: any = {}
    if (data.status) updateData.status = data.status
    if (data.priority) updateData.priority = data.priority
    if (data.zoneManagerId !== undefined) updateData.zoneManagerId = data.zoneManagerId

    const issue = await prisma.issue.update({
      where: { id: params.id },
      data: updateData,
      include: {
        booking: {
          include: {
            user: true,
            city: true,
          },
        },
        reporter: true,
        assignee: true,
      },
    })

    return NextResponse.json(issue)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error updating issue:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
