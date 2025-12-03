"use client"

import { Flower } from "lucide-react"

export function FloralSeparator() {
  return (
    <div className="relative my-8">
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute left-[20%] top-1/2 -translate-y-1/2">
        <Flower 
          className="text-border opacity-40" 
          strokeWidth={1.5}
          size={12}
        />
      </div>
      <div className="absolute right-[20%] top-1/2 -translate-y-1/2">
        <Flower 
          className="text-border opacity-40" 
          strokeWidth={1.5}
          size={12}
        />
      </div>
    </div>
  )
}

