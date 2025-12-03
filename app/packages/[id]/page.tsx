"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageWrapper } from "@/components/page-wrapper"
import { LoadingState } from "@/components/loading-state"
import { ArrowLeft, Sparkles, MapPin, Users, IndianRupee, CheckCircle2, ArrowRight, Wand2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

type PackagePreset = {
  id: string
  cityType: string
  includedServices: Record<string, any>
  basePrice: number
}

type PackageCategory = {
  id: string
  name: string
  description: string | null
  basePriceMetro: number
  basePriceTier2: number
  basePriceTier3: number
  defaultGuestRangeMin: number
  defaultGuestRangeMax: number
  presets: PackagePreset[]
}

export default function PackageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [pkg, setPkg] = useState<PackageCategory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/packages/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setPkg(data)
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
          <LoadingState message="Loading package details..." />
        </main>
      </div>
    )
  }

  if (!pkg) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="page-shell-premium">
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Package not found</p>
          </div>
        </main>
      </div>
    )
  }

  const servicesRaw = pkg.presets[0]?.includedServices
  const services = typeof servicesRaw === 'string' 
    ? JSON.parse(servicesRaw) 
    : (servicesRaw || {})

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/30 via-white to-white">
      <Navbar />
      <main className="page-shell-premium">
        <PageWrapper>
          {/* Back Button */}
          <div className="mb-8 pt-8">
            <Link href="/packages">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted/50">
                <ArrowLeft className="w-4 h-4" />
                Back to Packages
              </Button>
            </Link>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" strokeWidth={1.75} />
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                Premium Package
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-yellow-900 via-yellow-700 to-yellow-900 bg-clip-text text-transparent">
              {pkg.name}
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
              {pkg.description || "Experience luxury beyond compare with our premium wedding package, featuring top-tier services and unforgettable moments."}
            </p>
          </div>

          {/* Pricing & Details Card */}
          <Card className="card-elevated mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <IndianRupee className="h-6 w-6 text-primary" />
                Pricing by City Type
              </CardTitle>
              <CardDescription>Choose the pricing tier that matches your location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-100/50 hover:shadow-lg transition-all">
                  <div className="p-3 rounded-lg bg-blue-100/50">
                    <MapPin className="h-6 w-6 text-blue-600" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Metro Cities
                    </p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(pkg.basePriceMetro)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Mumbai, Delhi, Bangalore</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-purple-50/50 to-pink-50/30 border border-purple-100/50 hover:shadow-lg transition-all">
                  <div className="p-3 rounded-lg bg-purple-100/50">
                    <MapPin className="h-6 w-6 text-purple-600" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Tier 2 Cities
                    </p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(pkg.basePriceTier2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Pune, Hyderabad, Chennai</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-green-50/50 to-emerald-50/30 border border-green-100/50 hover:shadow-lg transition-all">
                  <div className="p-3 rounded-lg bg-green-100/50">
                    <MapPin className="h-6 w-6 text-green-600" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                      Tier 3 Cities
                    </p>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(pkg.basePriceTier3)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Other cities</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-yellow-50/50 to-amber-50/30 border border-yellow-100/50">
                <div className="p-3 rounded-lg bg-yellow-100/50">
                  <Users className="h-6 w-6 text-yellow-600" strokeWidth={1.75} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Guest Capacity
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {pkg.defaultGuestRangeMin} - {pkg.defaultGuestRangeMax} guests
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Perfect for your celebration size</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Included Card */}
          <Card className="card-elevated mb-8">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                What&apos;s Included
              </CardTitle>
              <CardDescription>Everything you need for your perfect wedding day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(services).map(([key, value], index) => (
                  <div 
                    key={key} 
                    className="flex items-start gap-4 p-4 rounded-xl border bg-gradient-to-br from-white to-muted/20 hover:shadow-md transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-primary" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold capitalize text-base mb-1 group-hover:text-primary transition-colors">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{String(value)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/planner?packageId=${pkg.id}`} className="flex-1">
              <Button size="lg" className="w-full btn-primary group">
                <Sparkles className="h-5 w-5 mr-2" />
                Start Planning with this Package
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/planner" className="flex-1">
              <Button size="lg" variant="outline" className="w-full group">
                <Wand2 className="h-5 w-5 mr-2" />
                Use AI Planner
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </PageWrapper>
      </main>
      <Footer />
    </div>
  )
}

