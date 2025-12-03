import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
// Icons are now handled in MetricCard component
import { StatusBadge } from '@/components/admin/status-badge'
import { PriorityBadge } from '@/components/admin/priority-badge'
import { PageWrapper } from '@/components/admin/page-wrapper'
import { MetricCard } from '@/components/admin/metric-card'
import Link from 'next/link'

export default async function AdminDashboard() {
  const user = await requireAdmin()
  // Get stats
  const [
    totalBookings,
    bookingsByStatus,
    totalRevenue,
    upcomingEvents,
    topCities,
    issuesStats,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.booking.aggregate({
      where: {
        status: { in: ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'] },
      },
      _sum: {
        totalPrice: true,
      },
    }),
    prisma.booking.findMany({
      where: {
        eventDate: {
          gte: new Date(),
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
        packageCategory: true,
      },
    }),
    prisma.booking.groupBy({
      by: ['cityId'],
      _count: true,
      _sum: {
        totalPrice: true,
      },
      orderBy: {
        _count: {
          cityId: 'desc',
        },
      },
      take: 5,
    }),
    prisma.issue.groupBy({
      by: ['status'],
      _count: true,
    }),
  ])

  // Get city names for top cities
  const cityIds = topCities.map((c) => c.cityId)
  const cities = await prisma.city.findMany({
    where: { id: { in: cityIds } },
  })
  const cityMap = new Map(cities.map((c) => [c.id, c.name]))

  const statusCounts = bookingsByStatus.reduce(
    (acc, item) => {
      acc[item.status] = item._count
      return acc
    },
    {} as Record<string, number>
  )

  const issueCounts = issuesStats.reduce(
    (acc, item) => {
      acc[item.status] = item._count
      return acc
    },
    {} as Record<string, number>
  )

  // Get latest issues
  const latestIssues = await prisma.issue.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      booking: {
        include: { user: true },
      },
    },
  })

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Hero Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor bookings, zones, and service quality
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Bookings"
          value={totalBookings}
          description="All time"
          iconName="LayoutDashboard"
          delay={0.1}
        />
        <MetricCard
          title="Revenue (Estimate)"
          value={formatCurrency(totalRevenue._sum.totalPrice || 0)}
          description="Confirmed & completed"
          iconName="DollarSign"
          delay={0.15}
          highlight
        />
        <MetricCard
          title="Upcoming Events"
          value={upcomingEvents.length}
          description="Next 10 confirmed"
          iconName="Calendar"
          delay={0.2}
        />
        <MetricCard
          title="Open Issues"
          value={issueCounts.OPEN || 0}
          description="Requires attention"
          iconName="AlertTriangle"
          delay={0.25}
        />
      </div>

      {/* Bookings by Status */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Bookings by Status</CardTitle>
          <CardDescription>Current distribution across all statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {['DRAFT', 'PENDING_PAYMENT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(
              (status) => (
                <div 
                  key={status} 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border"
                >
                  <StatusBadge status={status} />
                  <span className="text-lg font-bold">{statusCounts[status] || 0}</span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Next 10 confirmed events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm">No upcoming events</p>
              ) : (
                upcomingEvents.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/admin/bookings/${booking.id}`}
                    className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{booking.user.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {booking.city.name} • {booking.packageCategory.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(booking.eventDate)}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-semibold text-primary text-sm">
                          {formatCurrency(booking.totalPrice)}
                        </p>
                        <StatusBadge status={booking.status} />
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
            <CardDescription>Latest issues requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {latestIssues.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent issues</p>
              ) : (
                latestIssues.map((issue) => (
                  <Link
                    key={issue.id}
                    href={`/admin/issues/${issue.id}`}
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
            {latestIssues.length > 0 && (
              <Link
                href="/admin/issues"
                className="block mt-4 text-sm text-primary hover:underline text-center"
              >
                View all issues →
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Cities & Issues Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Top Cities by Bookings</CardTitle>
            <CardDescription>Highest booking volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {topCities.map((city) => (
                <div
                  key={city.cityId}
                  className="flex justify-between items-center p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-sm">{cityMap.get(city.cityId) || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">
                      {city._count} bookings
                    </p>
                  </div>
                  <p className="font-semibold text-primary">
                    {formatCurrency(city._sum.totalPrice || 0)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Issues Summary</CardTitle>
            <CardDescription>Status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
                <div 
                  key={status} 
                  className="text-center p-4 rounded-lg bg-muted/50 border"
                >
                  <p className="text-2xl font-bold">{issueCounts[status] || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">{status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </PageWrapper>
  )
}

