"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Guest = {
  id: string
  name: string
  phone: string | null
  email: string | null
  status: string
  inviteToken: string
  inviteUrl?: string
}

export function BookingGuests({ bookingId }: { bookingId: string }) {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  })

  useEffect(() => {
    fetch(`/api/bookings/${bookingId}/guests`)
      .then((res) => res.json())
      .then((data) => {
        setGuests(data)
        setLoading(false)
      })
  }, [bookingId])

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/bookings/${bookingId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const newGuest = await res.json()
      setGuests([...guests, newGuest])
      setFormData({ name: "", phone: "", email: "" })
      setShowForm(false)
    } catch (error) {
      console.error("Error adding guest:", error)
    }
  }

  const getInviteLink = (guest: Guest) => {
    return guest.inviteUrl || `${window.location.origin}/invite/${guest.inviteToken}`
  }

  const stats = {
    invited: guests.filter((g) => g.status === "INVITED").length,
    confirmed: guests.filter((g) => g.status === "CONFIRMED").length,
    declined: guests.filter((g) => g.status === "DECLINED").length,
    attended: guests.filter((g) => g.status === "ATTENDED").length,
  }

  if (loading) {
    return <p>Loading guests...</p>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Guest Management</CardTitle>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Cancel" : "Add Guest"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{stats.invited}</p>
              <p className="text-sm text-muted-foreground">Invited</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
              <p className="text-sm text-muted-foreground">Declined</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{stats.attended}</p>
              <p className="text-sm text-muted-foreground">Attended</p>
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleAddGuest} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <Button type="submit">Add Guest</Button>
            </form>
          )}

          <div className="space-y-2">
            {guests.map((guest) => (
              <div
                key={guest.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-semibold">{guest.name}</p>
                  {guest.phone && <p className="text-sm text-muted-foreground">{guest.phone}</p>}
                  {guest.email && <p className="text-sm text-muted-foreground">{guest.email}</p>}
                  <p className="text-xs mt-1">
                    Status: <span className="font-semibold">{guest.status}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-2">Invite Link</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(getInviteLink(guest))
                      alert("Invite link copied!")
                    }}
                  >
                    Copy Link
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

