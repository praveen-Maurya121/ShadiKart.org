import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { InviteRSVP } from '@/components/invite-rsvp'
import { PageWrapper } from '@/components/page-wrapper'
import { Calendar, MapPin, Users } from 'lucide-react'

export default async function InvitePage({
  params,
}: {
  params: { token: string }
}) {
  const guest = await prisma.guest.findUnique({
    where: { inviteToken: params.token },
    include: {
      booking: {
        include: {
          city: true,
          packageCategory: true,
        },
      },
    },
  })

  if (!guest) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-primary-100 flex items-center justify-center p-4">
      <PageWrapper>
        <Card className="card-elevated w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-4xl md:text-5xl mb-2">You're Invited!</CardTitle>
            <CardDescription className="text-lg">
              {guest.booking.packageCategory.name} Wedding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="font-display text-2xl md:text-3xl mb-2">Dear {guest.name},</p>
              <p className="text-muted-foreground text-lg">
                We would be honored to have you celebrate with us!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 p-6 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-semibold text-lg">{formatDate(guest.booking.eventDate)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-semibold text-lg">
                    {guest.booking.city.name}, {guest.booking.city.state}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Guest Count</p>
                  <p className="font-semibold text-lg">{guest.booking.guestCount} guests</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Status</p>
                <p className="font-semibold text-lg capitalize">{guest.status.toLowerCase()}</p>
              </div>
            </div>

            <InviteRSVP guest={guest} />
          </CardContent>
        </Card>
      </PageWrapper>
    </div>
  )
}
