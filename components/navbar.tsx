"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "./ui/button"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="logo-shine text-2xl md:text-3xl font-display font-extrabold tracking-tight">
          Shadikart
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              {session.user.role === 'CUSTOMER' && (
                <>
                  <Link href="/packages">
                    <Button variant="ghost">Packages</Button>
                  </Link>
                  <Link href="/bookings">
                    <Button variant="ghost">My Bookings</Button>
                  </Link>
                </>
              )}
              {session.user.role === 'ADMIN' && (
                <Link href="/admin">
                  <Button variant="ghost">Admin Panel</Button>
                </Link>
              )}
              {session.user.role === 'ZONE_MANAGER' && (
                <Link href="/ops">
                  <Button variant="ghost">Zone Operations</Button>
                </Link>
              )}
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

