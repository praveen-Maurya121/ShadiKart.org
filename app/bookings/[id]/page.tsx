"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageWrapper } from "@/components/page-wrapper"
import { LoadingState } from "@/components/loading-state"
import { formatCurrency, formatDate } from "@/lib/utils"
import { BookingSummary } from "@/components/booking-summary"
import { BookingCustomize } from "@/components/booking-customize"
import { BookingGuests } from "@/components/booking-guests"
import { BookingTimeline } from "@/components/booking-timeline"
import { BookingChat } from "@/components/booking-chat"
import { BookingMedia } from "@/components/booking-media"
import { BookingPayment } from "@/components/booking-payment"
import { ReportIssue } from "@/components/report-issue"
import { StatusChip } from "@/components/status-chip"
import { ArrowLeft, Calendar, MapPin, Sparkles } from "lucide-react"

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
  guests?: Array<{ id: string; name: string; status: string }>
  liveStreams?: Array<{ url: string; platform: string }>
  mediaAssets?: Array<{ url: string; type: string; label: string | null }>
  zoneAssignments?: Array<{ zone: { name: string }; status: string }>
  ratings?: Array<{ overallScore: number }>
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/bookings/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setBooking(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="page-shell-premium">
          <LoadingState message="Loading booking details..." />
        </main>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="page-shell-premium">
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Booking not found</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/30 via-white to-white flex flex-col">
      <Navbar />
      <main className="page-shell-premium flex-1">
        <PageWrapper>
          {/* Back Button */}
          <div className="mb-8 pt-8">
            <Link href="/bookings">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted/50">
                <ArrowLeft className="w-4 h-4" />
                Back to Bookings
              </Button>
            </Link>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" strokeWidth={1.75} />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Your Event
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
              <div className="flex-1">
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-yellow-900 via-yellow-700 to-yellow-900 bg-clip-text text-transparent">
                  {booking.packageCategory.name}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" strokeWidth={1.75} />
                    </div>
                    <span className="font-medium">
                      {booking.city.name}, {booking.city.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" strokeWidth={1.75} />
                    </div>
                    <span className="font-medium">
                      {formatDate(booking.eventDate)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <StatusChip status={booking.status} />
              </div>
            </div>
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="guests">Guests</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <BookingSummary booking={booking} />
            </TabsContent>

            <TabsContent value="customize">
              <BookingCustomize bookingId={booking.id} />
            </TabsContent>

            <TabsContent value="guests">
              <BookingGuests bookingId={booking.id} />
            </TabsContent>

            <TabsContent value="timeline">
              <BookingTimeline booking={booking} />
            </TabsContent>

            <TabsContent value="chat">
              <BookingChat bookingId={booking.id} />
            </TabsContent>

            <TabsContent value="media">
              <BookingMedia bookingId={booking.id} />
            </TabsContent>
          </Tabs>

          {booking.status !== "COMPLETED" && (
            <div className="mt-6">
              <BookingPayment bookingId={booking.id} totalPrice={booking.totalPrice} />
            </div>
          )}

          {booking.status === "COMPLETED" && (!booking.ratings || booking.ratings.length === 0) && (
            <Card className="card-soft mt-6">
              <CardContent className="py-6 text-center">
                <p className="mb-4 text-lg font-medium">How was your experience?</p>
                <Link href={`/bookings/${booking.id}/rate`}>
                  <Button className="btn-primary">Rate Your Experience</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <Card className="card-soft mt-6">
            <CardContent className="py-6">
              <ReportIssue bookingId={booking.id} />
            </CardContent>
          </Card>
        </PageWrapper>
      </main>
      <Footer />
    </div>
  )
}

