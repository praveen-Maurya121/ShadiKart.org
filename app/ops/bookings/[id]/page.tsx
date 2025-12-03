import { requireZoneManager } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { OpsBookingActions } from '@/components/ops-booking-actions'
import { StatusBadge } from '@/components/admin/status-badge'
import { StageBadge } from '@/components/admin/stage-badge'
import { BookingTimeline } from '@/components/admin/booking-timeline'
import { PageWrapper } from '@/components/admin/page-wrapper'
import { ArrowLeft, CalendarClock, MapPin, Package, Users, Radio, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PriorityBadge } from '@/components/admin/priority-badge'

export default async function OpsBookingDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await requireZoneManager()

  const zoneManager = await prisma.zoneManagerProfile.findUnique({
    where: { userId: user.id },
  })

  if (!zoneManager) {
    return <div>Zone manager profile not found</div>
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id: params.id,
      zoneAssignments: {
        some: {
          zoneId: zoneManager.zoneId,
        },
      },
    },
    include: {
      user: true,
      packageCategory: true,
      packagePreset: true,
      city: true,
      addOns: {
        include: { addOn: true },
      },
      guests: true,
      liveStreams: true,
      mediaAssets: true,
      issues: true,
      chatMessages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!booking) {
    notFound()
  }

  const servicesRaw = booking.packagePreset?.includedServices
  const services = typeof servicesRaw === 'string' 
    ? JSON.parse(servicesRaw) 
    : (servicesRaw || {})

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/ops/bookings">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-3xl font-bold">Event Overview</h1>
              <p className="text-muted-foreground text-sm mt-1">
                ID: <span className="font-mono">{booking.id.slice(0, 8).toUpperCase()}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={booking.status} />
            <StageBadge stage={booking.currentStage} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Event Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Overview Card */}
            <Card className="card-elevated">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{booking.packageCategory.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {formatDate(booking.eventDate)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <CalendarClock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date & Time</p>
                      <p className="font-semibold text-sm">{formatDate(booking.eventDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-semibold text-sm">
                        {booking.city.name}, {booking.city.state}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Package</p>
                      <p className="font-semibold text-sm">{booking.packageCategory.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg border">
                    <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Guests</p>
                      <p className="font-semibold text-sm">{booking.guestCount}</p>
                    </div>
                  </div>
                </div>

                {/* Live Stream */}
                {booking.liveStreams && booking.liveStreams.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-3">Live Stream</p>
                    <div className="space-y-2">
                      {booking.liveStreams.map((stream) => (
                        <a
                          key={stream.id}
                          href={stream.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <Radio className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{stream.platform}</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-4">Booking Timeline</p>
                  <BookingTimeline currentStage={booking.currentStage} />
                </div>

                {/* Quick Checklist */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-3">Quick Checklist</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Confirm venue setup</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Verify vendor coordination</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Check guest count</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>Prepare event timeline</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Issues for this Booking */}
            {booking.issues && booking.issues.length > 0 && (
              <Card className="card-soft">
                <CardHeader>
                  <CardTitle className="text-lg">Issues for this Booking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {booking.issues.map((issue) => (
                      <Link
                        key={issue.id}
                        href={`/ops/issues`}
                        className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{issue.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {issue.description}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <PriorityBadge priority={issue.priority} />
                            <StatusBadge status={issue.status} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Ops Actions */}
          <div className="space-y-6">
            <OpsBookingActions booking={booking} />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

