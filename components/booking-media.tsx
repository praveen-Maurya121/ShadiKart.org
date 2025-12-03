"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type MediaAsset = {
  id: string
  url: string
  type: string
  label: string | null
}

export function BookingMedia({ bookingId }: { bookingId: string }) {
  const [media, setMedia] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/bookings/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        setMedia(data.mediaAssets || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [bookingId])

  if (loading) {
    return <p>Loading media...</p>
  }

  if (media.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-muted-foreground">
            Media will be available here after your event
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Media</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {media.map((asset) => (
            <div key={asset.id} className="border rounded-lg overflow-hidden">
              {asset.type === "PHOTO" ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={asset.url}
                  alt={asset.label || "Event photo"}
                  className="w-full h-48 object-cover"
                />
              ) : asset.type === "VIDEO" ? (
                <video
                  src={asset.url}
                  controls
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {asset.label || "View Media"}
                  </a>
                </div>
              )}
              {asset.label && (
                <div className="p-2">
                  <p className="text-sm font-semibold">{asset.label}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

