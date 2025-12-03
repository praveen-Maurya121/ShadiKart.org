import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-config"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroSection } from "@/components/hero-section"
import { prisma } from "@/lib/db"

export default async function Home() {
  // Redirect logged-in users based on role
  const session = await getServerSession(authOptions)
  if (session?.user) {
    if (session.user.role === "ADMIN") {
      redirect("/admin")
    } else if (session.user.role === "ZONE_MANAGER") {
      redirect("/ops")
    } else if (session.user.role === "CUSTOMER") {
      redirect("/bookings")
    }
  }

  // Fetch package categories
  const packageCategories = await prisma.packageCategory.findMany({
    orderBy: {
      basePriceMetro: 'desc', // Order by price, highest first
    },
    take: 5, // Get top 5 categories
  })
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Package Categories */}
        <section className="section-muted scroll-fade">
          <div className="page-shell">
            <div className="text-center mb-8 md:mb-12 scroll-fade">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl mb-4">Our Wedding Packages</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Choose the perfect package for your special day</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-12 md:mb-16">
              {packageCategories.map((pkg, index) => (
                <Link 
                  key={pkg.id} 
                  href={`/packages/${pkg.id}`}
                  className="block h-full"
                >
                  <Card 
                    className={`card-soft hover:shadow-lg transition-all cursor-pointer h-full scroll-child ${
                      index === 0 ? 'premium-shimmer' : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg font-display">{pkg.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {pkg.description || "Explore this package"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mt-2 sm:mt-4">
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Starting from</p>
                        <p className="text-lg sm:text-xl font-bold text-primary">
                          ₹{pkg.basePriceMetro.toLocaleString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center scroll-fade">
              <Link href="/packages">
                <Button variant="outline" size="lg" className="btn-primary">
                  View All Packages
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-12 md:py-16 scroll-slide-up">
          <div className="page-shell">
            <div className="text-center mb-8 md:mb-12 scroll-fade">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl mb-4">Why Choose Shadikart?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <Link href="/planner" className="block h-full">
                <Card className="card-elevated scroll-child scroll-glow h-full hover:shadow-xl transition-all cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors">
                      AI-Powered Planning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm sm:text-base">Get personalized package recommendations based on your preferences and budget</p>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Try AI Planner →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/packages" className="block h-full">
                <Card className="card-elevated scroll-child scroll-glow h-full hover:shadow-xl transition-all cursor-pointer group" style={{ transitionDelay: '0.1s' }}>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors">
                      Complete Packages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm sm:text-base">Everything you need in one place - food, decor, photography, and more</p>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Browse Packages →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/planner" className="block h-full lg:col-span-1 md:col-span-2 lg:col-span-1">
                <Card className="card-elevated scroll-child scroll-glow h-full hover:shadow-xl transition-all cursor-pointer group" style={{ transitionDelay: '0.2s' }}>
                  <CardHeader>
                    <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors">
                      Expert Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm sm:text-base">Dedicated zone managers to guide you through every step</p>
                    <Button variant="ghost" size="sm" className="text-primary">
                      Get Started →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

