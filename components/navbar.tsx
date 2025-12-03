"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "./ui/button"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="logo-shine text-xl sm:text-2xl md:text-3xl font-display font-extrabold tracking-tight">
          Shadikart
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <>
              {session.user.role === 'CUSTOMER' && (
                <>
                  <Link href="/packages">
                    <Button variant="ghost" className="hidden lg:inline-flex">Packages</Button>
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
              <Button variant="outline" onClick={() => signOut()} className="text-sm">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="hidden sm:inline-flex">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="text-sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-yellow-100/50 bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {session ? (
              <>
                {session.user.role === 'CUSTOMER' && (
                  <>
                    <Link href="/packages" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">Packages</Button>
                    </Link>
                    <Link href="/bookings" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">My Bookings</Button>
                    </Link>
                  </>
                )}
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Admin Panel</Button>
                  </Link>
                )}
                {session.user.role === 'ZONE_MANAGER' && (
                  <Link href="/ops" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">Zone Operations</Button>
                  </Link>
                )}
                <Button variant="outline" onClick={() => { signOut(); setMobileMenuOpen(false); }} className="w-full">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Login</Button>
                </Link>
                <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

