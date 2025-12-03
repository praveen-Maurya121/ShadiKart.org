"use client"

import { useRouter } from "next/navigation"
import { TableRow } from "@/components/ui/table"
import { ReactNode } from "react"

interface RowLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function RowLink({ href, children, className }: RowLinkProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(href)
  }

  return (
    <TableRow
      onClick={handleClick}
      className={`cursor-pointer hover:bg-muted/50 ${className || ""}`}
    >
      {children}
    </TableRow>
  )
}

