import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { AdminBookingActions } from '@/components/admin-booking-actions'
import { StatusBadge } from '@/components/admin/status-badge'
import { StageBadge } from '@/components/admin/stage-badge'
import { BookingTimeline } from '@/components/admin/booking-timeline'
import { PageWrapper } from '@/components/admin/page-wrapper'
import { ArrowLeft, User, MapPin, Package, Users, DollarSign } from 'lucide-react'

export default async function AdminBookingDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
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
      zoneAssignments: {
        include: { zone: true },
      },
      ratings: true,
      issues: true,
    },
  })

  if (!booking) {
    notFound()
  }

  const servicesRaw = booking.packagePreset?.includedServices
  const services = typeof servicesRaw === 'string' 
    ? JSON.parse(servicesRaw) 
    : (servicesRaw || {})

  const zones = await prisma.zone.findMany()

  return (
    <PageWrapper>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/bookings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-3xl font-bold">Booking Details</h1>
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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Summary Card */}
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
              {/* Customer Info */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{booking.user.name}</p>
                  <p className="text-sm text-muted-foreground">{booking.user.email}</p>
                  {booking.user.phone && (
                    <p className="text-sm text-muted-foreground">{booking.user.phone}</p>
                  )}
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-2 gap-4">
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
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <DollarSign className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">Total Price</p>
                    <p className="font-semibold text-sm text-primary">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-4">Booking Timeline</p>
                <BookingTimeline currentStage={booking.currentStage} />
              </div>
            </CardContent>
          </Card>

          {/* Included Services */}
          <Card>
            <CardHeader>
              <CardTitle>Included Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(services).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div>
                      <p className="font-semibold capitalize">{key}</p>
                      <p className="text-sm text-muted-foreground">{String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add-ons */}
          {booking.addOns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Add-ons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {booking.addOns.map((addOn) => (
                    <div key={addOn.id} className="flex justify-between">
                      <span>{addOn.addOn.name}</span>
                      <span className="font-semibold">
                        {formatCurrency(addOn.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Included Services */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="text-lg">Included Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(services).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2 p-2 rounded border">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm capitalize">{key}</p>
                      <p className="text-xs text-muted-foreground">{String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add-ons */}
          {booking.addOns.length > 0 && (
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="text-lg">Add-ons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {booking.addOns.map((addOn) => (
                    <div key={addOn.id} className="flex justify-between items-center p-2 rounded border">
                      <span className="text-sm">{addOn.addOn.name}</span>
                      <span className="font-semibold text-sm text-primary">
                        {formatCurrency(addOn.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Zone Assignment */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="text-lg">Zone Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              {booking.zoneAssignments.length > 0 ? (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-semibold text-sm">
                      {booking.zoneAssignments[0].zone.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Status: {booking.zoneAssignments[0].status}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not assigned</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <AdminBookingActions booking={booking} zones={zones} />
        </div>
      </div>
      </div>
    </PageWrapper>
  )
}

