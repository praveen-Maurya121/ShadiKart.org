"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type Guest = {
  id: string
  name: string
  status: string
  inviteToken: string
}

export function InviteRSVP({ guest }: { guest: Guest }) {
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(guest.status)

  const handleRSVP = async (status: "CONFIRMED" | "DECLINED") => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/invite/${guest.inviteToken}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        setCurrentStatus(status)
        alert(`RSVP ${status === "CONFIRMED" ? "confirmed" : "declined"}!`)
        router.refresh()
      } else {
        alert("Failed to update RSVP")
      }
    } catch (error) {
      console.error("Error updating RSVP:", error)
      alert("Failed to update RSVP")
    } finally {
      setUpdating(false)
    }
  }

  if (currentStatus === "INVITED") {
    return (
      <div className="flex gap-4">
        <Button
          onClick={() => handleRSVP("CONFIRMED")}
          disabled={updating}
          className="flex-1"
          size="lg"
        >
          {updating ? "Updating..." : "I will attend"}
        </Button>
        <Button
          onClick={() => handleRSVP("DECLINED")}
          disabled={updating}
          variant="outline"
          className="flex-1"
          size="lg"
        >
          {updating ? "Updating..." : "I cannot attend"}
        </Button>
      </div>
    )
  }

  return (
    <div className="text-center p-4 bg-green-50 rounded-lg">
      <p className="text-green-800 font-semibold">
        You have {currentStatus === "CONFIRMED" ? "accepted" : "declined"} this invitation.
      </p>
    </div>
  )
}

