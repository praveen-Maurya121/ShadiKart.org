"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

type AddOn = {
  id: string
  name: string
  description: string | null
  priceType: string
  basePrice: number
}

export function BookingCustomize({ bookingId }: { bookingId: string }) {
  const [addOns, setAddOns] = useState<AddOn[]>([])
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/addons").then((res) => res.json()),
      fetch(`/api/bookings/${bookingId}`).then((res) => res.json()),
    ]).then(([allAddOns, booking]) => {
      setAddOns(allAddOns)
      setSelectedAddOns(booking.addOns?.map((ao: any) => ao.addOnId) || [])
      setLoading(false)
    })
  }, [bookingId])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/bookings/${bookingId}/addons`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addOnIds: selectedAddOns }),
      })
      window.location.reload()
    } catch (error) {
      console.error("Error updating add-ons:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p>Loading add-ons...</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Your Package</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {addOns.map((addOn) => (
            <label
              key={addOn.id}
              className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent"
            >
              <input
                type="checkbox"
                checked={selectedAddOns.includes(addOn.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedAddOns([...selectedAddOns, addOn.id])
                  } else {
                    setSelectedAddOns(selectedAddOns.filter((id) => id !== addOn.id))
                  }
                }}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-semibold">{addOn.name}</p>
                {addOn.description && (
                  <p className="text-sm text-muted-foreground">{addOn.description}</p>
                )}
                <p className="text-sm font-semibold text-primary-600 mt-1">
                  {formatCurrency(addOn.basePrice)}
                  {addOn.priceType === "PER_GUEST" && " per guest"}
                  {addOn.priceType === "PER_EVENT" && " per event"}
                </p>
              </div>
            </label>
          ))}
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  )
}

