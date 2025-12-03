"use client"

import { cn } from "@/lib/utils"

type Status = 
  | "DRAFT" 
  | "PENDING_PAYMENT" 
  | "CONFIRMED" 
  | "IN_PROGRESS" 
  | "COMPLETED" 
  | "CANCELLED"

type Stage = 
  | "PLANNING" 
  | "PRE_EVENT" 
  | "EVENT_DAY" 
  | "POST_EVENT"

export function StatusChip({ status }: { status: Status | Stage | string }) {
  const getStatusClass = (status: string) => {
    const normalized = status.toUpperCase()
    if (normalized === "CONFIRMED") return "chip-confirmed"
    if (normalized === "DRAFT") return "chip-draft"
    if (normalized === "PENDING_PAYMENT" || normalized === "PENDING") return "chip-pending"
    if (normalized === "IN_PROGRESS" || normalized === "IN_PROGRESS") return "chip-in-progress"
    if (normalized === "COMPLETED") return "chip-completed"
    if (normalized === "EVENT_DAY") return "chip-pending"
    return "chip"
  }

  return (
    <span className={cn("chip", getStatusClass(status))}>
      {status.replace("_", " ")}
    </span>
  )
}

