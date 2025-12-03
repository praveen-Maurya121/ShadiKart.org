"use client"

import { ReactNode } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import Link from "next/link"

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: {
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}) {
  const actionButton = actionLabel && (
    actionHref ? (
      <Link href={actionHref}>
        <Button className="btn-primary">{actionLabel}</Button>
      </Link>
    ) : onAction ? (
      <Button onClick={onAction} className="btn-primary">{actionLabel}</Button>
    ) : null
  )

  return (
    <Card className="card-soft">
      <CardContent className="py-16 text-center">
        <p className="text-lg font-semibold text-muted-foreground mb-2">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground mb-6">{description}</p>
        )}
        {actionButton}
      </CardContent>
    </Card>
  )
}

