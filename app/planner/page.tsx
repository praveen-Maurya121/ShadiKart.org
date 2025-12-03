"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageWrapper } from "@/components/page-wrapper"
import { LoadingState } from "@/components/loading-state"
import { formatCurrency } from "@/lib/utils"

type City = {
  id: string
  name: string
  state: string
  type: "METRO" | "TIER2" | "TIER3"
}

type PlannerResult = {
  packageCategoryId: string
  packagePresetId: string | null
  estimatedPrice: number
  suggestedAddOnIds: string[]
  summary: string
  categoryName?: string
  presetIncludedServices?: Record<string, any>
  suggestedAddOns?: Array<{
    id: string
    name: string
    description: string | null
    priceType: string
    basePrice: number
  }>
}

export default function PlannerPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [cities, setCities] = useState<City[]>([])
  const [formData, setFormData] = useState({
    cityId: "",
    guestCount: 100,
    budgetMin: 500000,
    budgetMax: 1000000,
    eventDate: "",
    preference: "TRADITIONAL" as "TRADITIONAL" | "TRENDY" | "FUSION" | "MINIMAL",
  })
  const [result, setResult] = useState<PlannerResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }

    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch(console.error)
  }, [status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityId: formData.cityId,
          guestCount: formData.guestCount,
          budgetMin: formData.budgetMin,
          budgetMax: formData.budgetMax,
          eventDate: formData.eventDate,
          preference: formData.preference,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get recommendation")
      }

      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBooking = async () => {
    if (!result) return

    setCreating(true)
    setError("")

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageCategoryId: result.packageCategoryId,
          packagePresetId: result.packagePresetId,
          cityId: formData.cityId,
          eventDate: formData.eventDate,
          guestCount: formData.guestCount,
          totalPrice: result.estimatedPrice,
          aiRecommendationSummary: result.summary,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create booking")
      }

      const booking = await response.json()
      router.push(`/bookings/${booking.id}`)
    } catch (err: any) {
      setError(err.message || "Failed to create booking")
    } finally {
      setCreating(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="page-shell-premium">
          <LoadingState message="Loading planner..." />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="page-shell-premium flex-1">
        <PageWrapper>
          <div className="text-center mb-8 md:mb-12 scroll-fade">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4">AI Wedding Planner</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4">
              Tell us about your dream wedding and we&apos;ll recommend the perfect package
            </p>
          </div>

        {!result ? (
          <Card className="card-elevated max-w-2xl mx-auto animate-fade-in">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Plan Your Wedding</CardTitle>
              <CardDescription>
                Fill in the details below to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={formData.cityId}
                    onValueChange={(value) => setFormData({ ...formData, cityId: value })}
                  >
                    <SelectTrigger id="city">
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}, {city.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestCount">Guest Count</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    min="1"
                    value={formData.guestCount}
                    onChange={(e) =>
                      setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetMin">Budget Min (₹)</Label>
                    <Input
                      id="budgetMin"
                      type="number"
                      min="0"
                      value={formData.budgetMin}
                      onChange={(e) =>
                        setFormData({ ...formData, budgetMin: parseInt(e.target.value) || 0 })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetMax">Budget Max (₹)</Label>
                    <Input
                      id="budgetMax"
                      type="number"
                      min="0"
                      value={formData.budgetMax}
                      onChange={(e) =>
                        setFormData({ ...formData, budgetMax: parseInt(e.target.value) || 0 })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preference">Style Preference</Label>
                  <Select
                    value={formData.preference}
                    onValueChange={(value: any) =>
                      setFormData({ ...formData, preference: value })
                    }
                  >
                    <SelectTrigger id="preference">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRADITIONAL">Traditional</SelectItem>
                      <SelectItem value="TRENDY">Trendy</SelectItem>
                      <SelectItem value="FUSION">Fusion</SelectItem>
                      <SelectItem value="MINIMAL">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? "Planning..." : "Get Recommendation"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="card-elevated max-w-2xl mx-auto animate-slide-up">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Your Wedding Recommendation</CardTitle>
              <CardDescription className="text-base">{result.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-accent/30 rounded-xl border border-accent">
                <h3 className="font-display text-xl mb-2">
                  Recommended Package: {result.categoryName}
                </h3>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(result.estimatedPrice)}
                </p>
              </div>

              {result.presetIncludedServices && (
                <div>
                  <h4 className="font-semibold mb-2">Included Services:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(result.presetIncludedServices).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value as string}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.suggestedAddOns && result.suggestedAddOns.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Suggested Add-ons:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.suggestedAddOns.map((addon) => (
                      <li key={addon.id}>
                        {addon.name} - {formatCurrency(addon.basePrice)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setResult(null)
                    setError("")
                  }}
                >
                  Start Over
                </Button>
                <Button 
                  onClick={handleCreateBooking} 
                  disabled={creating} 
                  className="btn-primary flex-1"
                >
                  {creating ? "Creating Booking..." : "Create Booking Draft"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        </PageWrapper>
      </main>
      <Footer />
    </div>
  )
}
