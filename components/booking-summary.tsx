"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"

type Booking = {
  id: string
  eventDate: string
  guestCount: number
  totalPrice: number
  status: string
  currentStage: string
  packageCategory: { name: string }
  packagePreset: { includedServices: Record<string, any> } | null
  city: { name: string; state: string }
  addOns?: Array<{ addOn: { name: string }; price: number }>
  liveStreams?: Array<{ url: string; platform: string }>
  zoneAssignments?: Array<{ zone: { name: string }; status: string }>
}

export function BookingSummary({ booking }: { booking: Booking }) {
  const servicesRaw = booking.packagePreset?.includedServices
  const services = typeof servicesRaw === 'string' 
    ? JSON.parse(servicesRaw) 
    : (servicesRaw || {})

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Event Date</p>
              <p className="font-semibold">{formatDate(booking.eventDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Guest Count</p>
              <p className="font-semibold">{booking.guestCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-semibold">
                {booking.city.name}, {booking.city.state}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Stage</p>
              <p className="font-semibold">{booking.currentStage.replace("_", " ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Included Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(services).map(([key, value]) => (
              <div key={key} className="flex items-start gap-3">
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

      {booking.addOns && booking.addOns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Add-ons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {booking.addOns.map((addOn, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{addOn.addOn.name}</span>
                  <span className="font-semibold">{formatCurrency(addOn.price)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Total Price</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary-600">
            {formatCurrency(booking.totalPrice)}
          </p>
        </CardContent>
      </Card>

      {booking.zoneAssignments && booking.zoneAssignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Zone Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            {booking.zoneAssignments.map((assignment, idx) => (
              <div key={idx}>
                <p className="font-semibold">{assignment.zone.name}</p>
                <p className="text-sm text-muted-foreground">
                  Status: {assignment.status}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {booking.liveStreams && booking.liveStreams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Live Streaming</CardTitle>
          </CardHeader>
          <CardContent>
            {booking.liveStreams.map((stream, idx) => (
              <div key={idx} className="mb-2">
                <a
                  href={stream.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {stream.platform} - Watch Live
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

