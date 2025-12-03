"use client"

import { User } from "lucide-react"
import { useSession } from "next-auth/react"

export function AdminHeader() {
  const { data: session } = useSession()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          {session?.user && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">{session.user.name}</span>
                  <span className="text-xs text-muted-foreground">Administrator</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <span className="text-primary font-semibold text-sm">
                    {getInitials(session.user.name || "A")}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                ADMIN
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

