"use client"

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <Button variant="outline" onClick={handleLogout} className="w-full">
      Sign Out
    </Button>
  )
}

