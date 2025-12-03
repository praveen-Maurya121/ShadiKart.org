"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Clock, XCircle, AlertCircle, Loader2, FileText } from "lucide-react"

type Status = 
  | "DRAFT" 
  | "PENDING_PAYMENT" 
  | "CONFIRMED" 
  | "IN_PROGRESS" 
  | "COMPLETED" 
  | "CANCELLED"

const statusConfig: Record<Status, { 
  label: string
  className: string
  icon: React.ComponentType<{ className?: string }>
}> = {
  DRAFT: {
    label: "Draft",
    className: "bg-muted text-muted-foreground border-muted-foreground/20",
    icon: FileText,
  },
  PENDING_PAYMENT: {
    label: "Pending Payment",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Loader2,
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
}

export function StatusBadge({ status }: { status: Status | string }) {
  const normalized = status.toUpperCase() as Status
  const config = statusConfig[normalized] || statusConfig.DRAFT
  const Icon = config.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
        config.className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

