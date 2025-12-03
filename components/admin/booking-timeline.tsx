"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, Circle } from "lucide-react"

type Stage = "PLANNING" | "PRE_EVENT" | "EVENT_DAY" | "POST_EVENT" | "COMPLETED"

const stages: Stage[] = ["PLANNING", "PRE_EVENT", "EVENT_DAY", "POST_EVENT", "COMPLETED"]

const stageLabels: Record<Stage, string> = {
  PLANNING: "Planning",
  PRE_EVENT: "Pre-Event",
  EVENT_DAY: "Event Day",
  POST_EVENT: "Post-Event",
  COMPLETED: "Completed",
}

export function BookingTimeline({ currentStage }: { currentStage: string }) {
  const currentIndex = stages.indexOf(currentStage.toUpperCase() as Stage)

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex
          const Icon = isCompleted ? CheckCircle2 : Circle

          return (
            <div key={stage} className="flex flex-col items-center flex-1 relative">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                  isCompleted
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted text-muted-foreground border-muted-foreground/30",
                  isCurrent && "ring-4 ring-primary/20"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {stageLabels[stage]}
              </span>
              {index < stages.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 left-[60%] w-full h-0.5 -z-10",
                    index < currentIndex ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

