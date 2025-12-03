"use client"

import { Sparkles } from "lucide-react"

export function SparkleIcon({ className }: { className?: string }) {
  return (
    <Sparkles 
      className={className} 
      strokeWidth={1.75}
      size={16}
    />
  )
}

