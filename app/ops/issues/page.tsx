import { requireZoneManager } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/admin/status-badge'
import { PriorityBadge } from '@/components/admin/priority-badge'
import { PageWrapper } from '@/components/admin/page-wrapper'
import { Button } from '@/components/ui/button'

export default async function OpsIssuesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await requireZoneManager()

  const zoneManager = await prisma.zoneManagerProfile.findUnique({
    where: { userId: user.id },
  })

  if (!zoneManager) {
    return <div>Zone manager profile not found</div>
  }

  const statusFilter = searchParams.status as string | undefined
  const priorityFilter = searchParams.priority as string | undefined

  const where: any = {
    OR: [
      { zoneManagerId: zoneManager.id },
      {
        booking: {
          zoneAssignments: {
            some: {
              zoneId: zoneManager.zoneId,
            },
          },
        },
      },
    ],
  }

  if (statusFilter && statusFilter !== 'all') {
    where.status = statusFilter
  }
  if (priorityFilter && priorityFilter !== 'all') {
    where.priority = priorityFilter
  }

  const issues = await prisma.issue.findMany({
    where,
    include: {
      booking: {
        include: {
          user: true,
          city: true,
        },
      },
      reporter: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return formatDate(date)
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold">Issues in Your Zone</h1>
          <p className="text-muted-foreground mt-1">Handle customer concerns quickly</p>
        </div>

        {/* Filters */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <form method="get" className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="flex gap-2">
                  {['all', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => (
                    <Link
                      key={s}
                      href={`?status=${s}${priorityFilter ? `&priority=${priorityFilter}` : ''}`}
                    >
                      <Button
                        type="button"
                        variant={statusFilter === s || (!statusFilter && s === 'all') ? "default" : "outline"}
                        size="sm"
                      >
                        {s === 'all' ? 'All' : s.replace('_', ' ')}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Priority:</span>
                <div className="flex gap-2">
                  {['all', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
                    <Link
                      key={p}
                      href={`?priority=${p}${statusFilter ? `&status=${statusFilter}` : ''}`}
                    >
                      <Button
                        type="button"
                        variant={priorityFilter === p || (!priorityFilter && p === 'all') ? "default" : "outline"}
                        size="sm"
                      >
                        {p === 'all' ? 'All' : p}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Issues List */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Issues</CardTitle>
                <CardDescription>{issues.length} total issues</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {issues.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No issues found</p>
              ) : (
                issues.map((issue) => (
                  <Link
                    key={issue.id}
                    href={`/ops/bookings/${issue.bookingId}`}
                    className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-sm">{issue.title}</p>
                          <StatusBadge status={issue.status} />
                          <PriorityBadge priority={issue.priority} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {issue.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Booking: {issue.booking.user.name} • {issue.booking.city.name} • Reported by: {issue.reporter.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {getRelativeTime(issue.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}

