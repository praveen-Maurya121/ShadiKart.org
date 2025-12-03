"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Radio, Image as ImageIcon } from "lucide-react"

type Booking = {
  id: string
  currentStage: string
  liveStreams: Array<{ id: string; platform: string; url: string }>
  mediaAssets: Array<{ id: string; url: string; type: string; label: string | null }>
}

export function OpsBookingActions({ booking }: { booking: Booking }) {
  const [stage, setStage] = useState(booking.currentStage)
  const [livestreamUrl, setLivestreamUrl] = useState("")
  const [livestreamPlatform, setLivestreamPlatform] = useState("YOUTUBE")
  const [mediaUrl, setMediaUrl] = useState("")
  const [mediaType, setMediaType] = useState("PHOTO")
  const [loading, setLoading] = useState(false)

  const handleUpdateStage = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/ops/bookings/${booking.id}/stage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentStage: stage }),
      })
      if (res.ok) {
        alert("Stage updated successfully")
        window.location.reload()
      }
    } catch (error) {
      console.error("Error updating stage:", error)
      alert("Failed to update stage")
    } finally {
      setLoading(false)
    }
  }

  const handleAddLivestream = async () => {
    if (!livestreamUrl) return
    setLoading(true)
    try {
      const res = await fetch(`/api/ops/bookings/${booking.id}/livestream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: livestreamUrl,
          platform: livestreamPlatform,
        }),
      })
      if (res.ok) {
        alert("Live stream added successfully")
        setLivestreamUrl("")
        window.location.reload()
      }
    } catch (error) {
      console.error("Error adding livestream:", error)
      alert("Failed to add livestream")
    } finally {
      setLoading(false)
    }
  }

  const handleAddMedia = async () => {
    if (!mediaUrl) return
    setLoading(true)
    try {
      const res = await fetch(`/api/ops/bookings/${booking.id}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: mediaUrl,
          type: mediaType,
        }),
      })
      if (res.ok) {
        alert("Media added successfully")
        setMediaUrl("")
        window.location.reload()
      }
    } catch (error) {
      console.error("Error adding media:", error)
      alert("Failed to add media")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-lg">Update Stage</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Current Stage</Label>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLANNING">Planning</SelectItem>
                <SelectItem value="PRE_EVENT">Pre-Event</SelectItem>
                <SelectItem value="EVENT_DAY">Event Day</SelectItem>
                <SelectItem value="POST_EVENT">Post-Event</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleUpdateStage} 
            disabled={loading} 
            className="w-full"
            variant="secondary"
            size="sm"
          >
            {loading ? "Updating..." : "Update Stage"}
          </Button>
        </CardContent>
      </Card>

      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-lg">Add Live Stream</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Platform</Label>
            <Select value={livestreamPlatform} onValueChange={setLivestreamPlatform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YOUTUBE">YouTube</SelectItem>
                <SelectItem value="ZOOM">Zoom</SelectItem>
                <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">URL</Label>
            <Input
              value={livestreamUrl}
              onChange={(e) => setLivestreamUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <Button 
            onClick={handleAddLivestream} 
            disabled={loading || !livestreamUrl} 
            className="w-full"
            variant="secondary"
            size="sm"
          >
            {loading ? "Adding..." : "Add Live Stream"}
          </Button>
        </CardContent>
      </Card>

      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-lg">Add Media</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Type</Label>
            <Select value={mediaType} onValueChange={setMediaType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PHOTO">Photo</SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">URL</Label>
            <Input
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <Button 
            onClick={handleAddMedia} 
            disabled={loading || !mediaUrl} 
            className="w-full"
            variant="secondary"
            size="sm"
          >
            {loading ? "Adding..." : "Add Media"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

