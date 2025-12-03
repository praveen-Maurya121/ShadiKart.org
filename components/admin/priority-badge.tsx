"use client"

import { cn } from "@/lib/utils"
import { AlertTriangle, AlertCircle, Info } from "lucide-react"

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

const priorityConfig: Record<Priority, { 
  label: string
  className: string
  icon: React.ComponentType<{ className?: string }>
}> = {
  LOW: {
    label: "Low",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Info,
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertCircle,
  },
  HIGH: {
    label: "High",
    className: "bg-orange-50 text-orange-700 border-orange-200",
    icon: AlertTriangle,
  },
  URGENT: {
    label: "Urgent",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: AlertTriangle,
  },
}

export function PriorityBadge({ priority }: { priority: Priority | string }) {
  const normalized = priority.toUpperCase() as Priority
  const config = priorityConfig[normalized] || priorityConfig.MEDIUM
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

