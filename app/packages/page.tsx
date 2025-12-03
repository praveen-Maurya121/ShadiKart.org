"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { PageWrapper } from "@/components/page-wrapper"
import { LoadingState } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { formatCurrency } from "@/lib/utils"
import { Sparkles, Users, IndianRupee } from "lucide-react"

type PackageCategory = {
  id: string
  name: string
  description: string | null
  basePriceMetro: number
  basePriceTier2: number
  basePriceTier3: number
  defaultGuestRangeMin: number
  defaultGuestRangeMax: number
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/packages")
      .then((res) => res.json())
      .then((data) => {
        setPackages(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getPriceRange = (pkg: PackageCategory) => {
    const prices = [pkg.basePriceMetro, pkg.basePriceTier2, pkg.basePriceTier3]
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return { min, max }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/30 via-white to-white">
      <Navbar />
      <main className="page-shell-premium">
        <PageWrapper>
          {/* Hero Section */}
          <div className="text-center mb-16 pt-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" strokeWidth={1.75} />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Premium Packages
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-yellow-900 via-yellow-700 to-yellow-900 bg-clip-text text-transparent">
              Our Wedding Packages
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the perfect package for your special day. Each package is carefully curated to make your celebration unforgettable.
            </p>
          </div>

          {loading ? (
            <LoadingState message="Loading packages..." />
          ) : packages.length === 0 ? (
            <EmptyState
              title="No packages available"
              description="Please check back later"
            />
          ) : (
            <div className="space-y-12">
              {/* Packages Grid */}
              <div className="flex flex-wrap justify-center gap-8">
                {packages.map((pkg, index) => {
                  const { min, max } = getPriceRange(pkg)
                  return (
                    <Link 
                      key={pkg.id} 
                      href={`/packages/${pkg.id}`} 
                      className="block h-full w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] max-w-md group"
                    >
                      <Card 
                        className={`card-elevated h-full transition-all duration-300 cursor-pointer group-hover:scale-[1.02] ${
                          index === 0 ? 'premium-shimmer border-primary/20' : ''
                        }`}
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle className="font-display text-2xl group-hover:text-primary transition-colors">
                              {pkg.name}
                            </CardTitle>
                            {index === 0 && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                <Sparkles className="h-3 w-3" />
                                Premium
                              </span>
                            )}
                          </div>
                          <CardDescription className="text-base leading-relaxed">
                            {pkg.description || "Explore this premium package"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-yellow-50/50 to-amber-50/30 border border-yellow-100/50">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <IndianRupee className="h-5 w-5 text-primary" strokeWidth={1.75} />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                                  Price Range
                                </p>
                                <p className="text-2xl font-bold text-primary">
                                  {formatCurrency(min)} - {formatCurrency(max)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Users className="h-5 w-5 text-primary" strokeWidth={1.75} />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                                  Guest Capacity
                                </p>
                                <p className="text-lg font-semibold">
                                  {pkg.defaultGuestRangeMin} - {pkg.defaultGuestRangeMax} guests
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <Button className="w-full btn-primary group-hover:shadow-lg transition-all">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>

              {/* Call to Action */}
              <div className="text-center pt-8 border-t">
                <p className="text-muted-foreground mb-4">
                  Need help choosing? Let our AI planner recommend the perfect package for you.
                </p>
                <Link href="/planner">
                  <Button variant="outline" size="lg" className="btn-primary">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Try AI Planner
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </PageWrapper>
      </main>
    </div>
  )
}

