"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CalendarClock,
  PlayCircle,
  AlertTriangle,
  CalendarDays,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  CalendarClock,
  PlayCircle,
  AlertTriangle,
  CalendarDays,
}

export function OpsMetricCard({
  title,
  value,
  description,
  iconName,
  delay = 0,
  highlight,
}: {
  title: string
  value: string | number
  description?: string
  iconName: keyof typeof iconMap
  delay?: number
  highlight?: boolean
}) {
  const Icon = iconMap[iconName]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card className="card-soft">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && (
            <Icon className={highlight ? "w-4 h-4 text-primary" : "w-4 h-4 text-muted-foreground"} />
          )}
        </CardHeader>
        <CardContent>
          <div className={highlight ? "text-3xl font-bold text-primary" : "text-3xl font-bold"}>
            {value}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

