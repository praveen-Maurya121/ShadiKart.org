import { requireUser } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { RatingForm } from '@/components/rating-form'

export default async function RatePage({
  params,
}: {
  params: { id: string }
}) {
  const user = await requireUser('CUSTOMER')

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      ratings: true,
    },
  })

  if (!booking) {
    redirect('/bookings')
  }

  if (booking.userId !== user.id) {
    redirect('/bookings')
  }

  if (booking.status !== 'COMPLETED') {
    redirect(`/bookings/${booking.id}`)
  }

  // Check if rating already exists
  if (booking.ratings.length > 0) {
    const rating = booking.ratings[0]
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="page-shell-premium">
          <PageWrapper>
            <Card className="card-elevated max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <h2 className="font-display text-3xl mb-6 text-primary">
                  Thank you for your rating!
                </h2>
                <div className="space-y-3 text-left max-w-md mx-auto">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="font-medium">Overall</span>
                    <span className="text-lg font-bold text-primary">{rating.overallScore}/5</span>
                  </div>
                  {rating.foodScore && (
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="font-medium">Food</span>
                      <span className="text-lg font-bold">{rating.foodScore}/5</span>
                    </div>
                  )}
                  {rating.decorScore && (
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="font-medium">Decoration</span>
                      <span className="text-lg font-bold">{rating.decorScore}/5</span>
                    </div>
                  )}
                  {rating.experienceScore && (
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="font-medium">Experience</span>
                      <span className="text-lg font-bold">{rating.experienceScore}/5</span>
                    </div>
                  )}
                  {rating.comments && (
                    <div className="mt-6 p-4 rounded-lg border bg-muted/20">
                      <p className="text-sm text-muted-foreground mb-2">Your Comment</p>
                      <p className="italic">"{rating.comments}"</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </PageWrapper>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="page-shell-premium">
        <PageWrapper>
          <RatingForm bookingId={booking.id} />
        </PageWrapper>
      </main>
    </div>
  )
}
