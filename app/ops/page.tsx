import { requireZoneManager } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { OpsMetricCard } from '@/components/ops/ops-metric-card'
import { StatusBadge } from '@/components/admin/status-badge'
import { StageBadge } from '@/components/admin/stage-badge'
import { PriorityBadge } from '@/components/admin/priority-badge'
import { PageWrapper } from '@/components/admin/page-wrapper'
import { MapPin, CalendarClock } from 'lucide-react'
import Link from 'next/link'

export default async function OpsDashboard() {
  const user = await requireZoneManager()

  // Get bookings for this zone manager's zone
  const zoneManager = await prisma.zoneManagerProfile.findUnique({
    where: { userId: user.id },
    include: { zone: true },
  })

  if (!zoneManager) {
    return <div>Zone manager profile not found</div>
  }

  // Get today's date range
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  const [
    assignedBookings,
    todaysEvents,
    bookingsByStage,
    upcomingEvents,
    inProgressBookings,
    openIssues,
  ] = await Promise.all([
    prisma.booking.findMany({
      where: {
        zoneAssignments: {
          some: {
            zoneId: zoneManager.zoneId,
          },
        },
      },
      include: {
        user: true,
        city: true,
        packageCategory: true,
      },
    }),
    // Today's events
    prisma.booking.findMany({
      where: {
        zoneAssignments: {
          some: {
            zoneId: zoneManager.zoneId,
          },
        },
        eventDate: {
          gte: today,
          lt: tomorrow,
        },
        status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
      },
      include: {
        user: true,
        city: true,
      },
    }),
    prisma.booking.groupBy({
      by: ['currentStage'],
      where: {
        zoneAssignments: {
          some: {
            zoneId: zoneManager.zoneId,
          },
        },
      },
      _count: true,
    }),
    // Upcoming events (next 7 days)
    prisma.booking.findMany({
      where: {
        zoneAssignments: {
          some: {
            zoneId: zoneManager.zoneId,
          },
        },
        eventDate: {
          gte: tomorrow,
          lte: nextWeek,
        },
        status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
      },
      take: 10,
      orderBy: {
        eventDate: 'asc',
      },
      include: {
        user: true,
        city: true,
      },
    }),
    // In-progress bookings
    prisma.booking.findMany({
      where: {
        zoneAssignments: {
          some: {
            zoneId: zoneManager.zoneId,
          },
        },
        status: 'IN_PROGRESS',
      },
      include: {
        user: true,
      },
    }),
    prisma.issue.findMany({
      where: {
        OR: [
          { zoneManagerId: user.id },
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
        status: { in: ['OPEN', 'IN_PROGRESS'] },
      },
      include: {
        booking: {
          include: { user: true },
        },
      },
    }),
  ])

  const stageCounts = (bookingsByStage as Array<{ currentStage: string; _count: number }>).reduce(
    (acc, item) => {
      acc[item.currentStage] = item._count || 0
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Zone Operations</h1>
            <p className="text-muted-foreground mt-1">
              Live view of weddings in your zone
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{zoneManager.zone.name}</span>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <OpsMetricCard
            title="Today's Events"
            value={todaysEvents.length}
            description="Events happening today"
            iconName="CalendarClock"
            delay={0.1}
            highlight
          />
          <OpsMetricCard
            title="Upcoming 7 Days"
            value={upcomingEvents.length}
            description="Next week's events"
            iconName="CalendarDays"
            delay={0.15}
          />
          <OpsMetricCard
            title="In-Progress"
            value={inProgressBookings.length}
            description="Active bookings"
            iconName="PlayCircle"
            delay={0.2}
          />
          <OpsMetricCard
            title="Open Issues"
            value={openIssues.length}
            description="Requires attention"
            iconName="AlertTriangle"
            delay={0.25}
          />
        </div>

        {/* Bookings by Stage */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Bookings by Stage</CardTitle>
            <CardDescription>Current distribution across all stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {['PLANNING', 'PRE_EVENT', 'EVENT_DAY', 'POST_EVENT', 'COMPLETED'].map((stage) => (
                <div 
                  key={stage} 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border"
                >
                  <StageBadge stage={stage} />
                  <span className="text-lg font-bold">{stageCounts[stage] || 0}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today / Upcoming Bookings */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Today & Upcoming Bookings</CardTitle>
              <CardDescription>Next 5 events in your zone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...todaysEvents, ...upcomingEvents].slice(0, 5).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No upcoming events</p>
                ) : (
                  [...todaysEvents, ...upcomingEvents].slice(0, 5).map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/ops/bookings/${booking.id}`}
                      className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CalendarClock className="w-3 h-3 text-muted-foreground" />
                            <p className="font-semibold text-sm">{booking.user.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {booking.city.name} • {formatDate(booking.eventDate)}
                          </p>
                        </div>
                        <div className="text-right ml-4 flex flex-col items-end gap-1">
                          <StatusBadge status={booking.status} />
                          <StageBadge stage={booking.currentStage} />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Issues Preview */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Recent Issues</CardTitle>
              <CardDescription>Latest issues in your zone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {openIssues.slice(0, 5).length === 0 ? (
                  <p className="text-muted-foreground text-sm">No open issues</p>
                ) : (
                  openIssues.slice(0, 5).map((issue) => (
                    <Link
                      key={issue.id}
                      href={`/ops/issues`}
                      className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{issue.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {issue.booking.user.name}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <PriorityBadge priority={issue.priority} />
                          <StatusBadge status={issue.status} />
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              {openIssues.length > 5 && (
                <Link
                  href="/ops/issues"
                  className="block mt-4 text-sm text-primary hover:underline text-center"
                >
                  View all issues →
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}

