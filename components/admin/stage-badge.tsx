"use client"

import { cn } from "@/lib/utils"
import { Calendar, Sparkles, PartyPopper, Gift } from "lucide-react"

type Stage = 
  | "PLANNING" 
  | "PRE_EVENT" 
  | "EVENT_DAY" 
  | "POST_EVENT" 
  | "COMPLETED"

const stageConfig: Record<Stage, { 
  label: string
  className: string
  icon: React.ComponentType<{ className?: string }>
}> = {
  PLANNING: {
    label: "Planning",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Calendar,
  },
  PRE_EVENT: {
    label: "Pre-Event",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Sparkles,
  },
  EVENT_DAY: {
    label: "Event Day",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: PartyPopper,
  },
  POST_EVENT: {
    label: "Post-Event",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Gift,
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Gift,
  },
}

export function StageBadge({ stage }: { stage: Stage | string }) {
  const normalized = stage.toUpperCase() as Stage
  const config = stageConfig[normalized] || stageConfig.PLANNING
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

