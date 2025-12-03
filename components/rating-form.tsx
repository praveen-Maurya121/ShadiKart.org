"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function RatingForm({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    overallScore: 5,
    foodScore: undefined as number | undefined,
    decorScore: undefined as number | undefined,
    experienceScore: undefined as number | undefined,
    comments: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          overallScore: formData.overallScore,
          foodScore: formData.foodScore,
          decorScore: formData.decorScore,
          experienceScore: formData.experienceScore,
          comments: formData.comments || undefined,
        }),
      })

      if (res.ok) {
        router.push(`/bookings/${bookingId}`)
        router.refresh()
      } else {
        const errorData = await res.json()
        setError(errorData.error || "Failed to submit rating")
      }
    } catch (error) {
      console.error("Error submitting rating:", error)
      setError("Failed to submit rating")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="card-elevated max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="font-display text-3xl mb-2">Rate Your Experience</CardTitle>
        <CardDescription className="text-base">
          Help us improve by sharing your feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="overallScore">Overall Rating *</Label>
            <Input
              id="overallScore"
              type="number"
              min="1"
              max="5"
              value={formData.overallScore}
              onChange={(e) =>
                setFormData({ ...formData, overallScore: parseInt(e.target.value) || 5 })
              }
              required
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Rate from 1 to 5</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="foodScore">Food Quality (Optional)</Label>
            <Input
              id="foodScore"
              type="number"
              min="1"
              max="5"
              value={formData.foodScore || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  foodScore: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="decorScore">Decoration (Optional)</Label>
            <Input
              id="decorScore"
              type="number"
              min="1"
              max="5"
              value={formData.decorScore || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  decorScore: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experienceScore">Overall Experience (Optional)</Label>
            <Input
              id="experienceScore"
              type="number"
              min="1"
              max="5"
              value={formData.experienceScore || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  experienceScore: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments (Optional)</Label>
            <textarea
              id="comments"
              className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={submitting} className="flex-1 btn-primary">
              {submitting ? "Submitting..." : "Submit Rating"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

