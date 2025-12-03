import { requireUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { PageWrapper } from "@/components/page-wrapper"
import { EmptyState } from "@/components/empty-state"
import { formatCurrency, formatDate } from "@/lib/utils"
import { StatusChip } from "@/components/status-chip"
import { Calendar, MapPin, Users, IndianRupee, Sparkles, ArrowRight } from "lucide-react"

export default async function BookingsPage() {
  const user = await requireUser('CUSTOMER')
  
  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: {
      packageCategory: true,
      city: true,
      packagePreset: true,
    },
    orderBy: { createdAt: 'desc' },
  })


  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/30 via-white to-white">
      <Navbar />
      <main className="page-shell-premium">
        <PageWrapper>
          {/* Header Section */}
          <div className="mb-12 pt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" strokeWidth={1.75} />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                    Your Events
                  </span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-3 bg-gradient-to-r from-yellow-900 via-yellow-700 to-yellow-900 bg-clip-text text-transparent">
                  My Bookings
                </h1>
                <p className="text-muted-foreground text-lg">
                  Welcome back, <strong className="text-foreground">{user.name}</strong>. Here are your upcoming events.
                </p>
              </div>
              <Link href="/planner">
                <Button className="btn-primary group">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create New Booking
                </Button>
              </Link>
            </div>
          </div>

          {bookings.length === 0 ? (
            <EmptyState
              title="No bookings yet"
              description="Start planning your dream wedding today with our AI-powered planner"
              actionLabel="Start Planning"
              actionHref="/planner"
            />
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <Card 
                  key={booking.id} 
                  className="card-elevated group hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Calendar className="h-5 w-5 text-primary" strokeWidth={1.75} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="font-display text-2xl mb-1 group-hover:text-primary transition-colors">
                              {booking.packageCategory.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1.5 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {booking.city.name}, {booking.city.state}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <StatusChip status={booking.status} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Key Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-100/50">
                        <div className="p-2 rounded-lg bg-blue-100/50">
                          <Calendar className="h-5 w-5 text-blue-600" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                            Event Date
                          </p>
                          <p className="font-semibold text-base">{formatDate(booking.eventDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/30 border border-purple-100/50">
                        <div className="p-2 rounded-lg bg-purple-100/50">
                          <Users className="h-5 w-5 text-purple-600" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                            Guests
                          </p>
                          <p className="font-semibold text-base">{booking.guestCount} people</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-yellow-50/50 to-amber-50/30 border border-yellow-100/50">
                        <div className="p-2 rounded-lg bg-yellow-100/50">
                          <IndianRupee className="h-5 w-5 text-yellow-600" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                            Total Price
                          </p>
                          <p className="font-bold text-lg text-primary">
                            {formatCurrency(booking.totalPrice)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center">
                      <Link href={`/bookings/${booking.id}`}>
                        <Button className="w-[200px] btn-primary group/btn">
                          View Full Details
                          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </PageWrapper>
      </main>
    </div>
  )
}

