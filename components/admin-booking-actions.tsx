"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, BadgeCheck, Calendar } from "lucide-react"
import { motion } from "framer-motion"

type Booking = {
  id: string
  status: string
  currentStage: string
  zoneAssignments: Array<{ id: string; zoneId: string; zone: { name: string } }>
}

type Zone = {
  id: string
  name: string
}

export function AdminBookingActions({
  booking,
  zones,
}: {
  booking: Booking
  zones: Zone[]
}) {
  const [status, setStatus] = useState(booking.status)
  const [stage, setStage] = useState(booking.currentStage)
  const [zoneId, setZoneId] = useState(booking.zoneAssignments[0]?.zoneId || "")
  const [loading, setLoading] = useState(false)

  const handleUpdateStatus = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        alert("Status updated successfully")
        window.location.reload()
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStage = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/stage`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
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

  const handleAssignZone = async () => {
    if (!zoneId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}/zone`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zoneId }),
      })
      if (res.ok) {
        alert("Zone assigned successfully")
        window.location.reload()
      }
    } catch (error) {
      console.error("Error assigning zone:", error)
      alert("Failed to assign zone")
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
            <BadgeCheck className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-lg">Update Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleUpdateStatus} 
            disabled={loading} 
            className="w-full"
            variant="secondary"
            size="sm"
          >
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </CardContent>
      </Card>

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
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-lg">Assign Zone</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Zone</Label>
            <Select value={zoneId} onValueChange={setZoneId}>
              <SelectTrigger>
                <SelectValue placeholder="Select zone" />
              </SelectTrigger>
              <SelectContent>
                {zones.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id}>
                    {zone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleAssignZone} 
            disabled={loading || !zoneId} 
            className="w-full"
            variant="secondary"
            size="sm"
          >
            {loading ? "Assigning..." : "Assign Zone"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

