import { requireZoneManager } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/admin/status-badge'
import { StageBadge } from '@/components/admin/stage-badge'
import { PageWrapper } from '@/components/admin/page-wrapper'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { MapPin, Filter, Users } from 'lucide-react'

export default async function OpsBookingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user = await requireZoneManager()

  const zoneManager = await prisma.zoneManagerProfile.findUnique({
    where: { userId: user.id },
  })

  if (!zoneManager) {
    return <div>Zone manager profile not found</div>
  }

  const statusFilter = searchParams.status as string | undefined
  const stageFilter = searchParams.stage as string | undefined
  const dateFilter = searchParams.date as string | undefined

  const where: any = {
    zoneAssignments: {
      some: {
        zoneId: zoneManager.zoneId,
      },
    },
  }

  if (statusFilter && statusFilter !== 'all') where.status = statusFilter
  if (stageFilter && stageFilter !== 'all') where.currentStage = stageFilter
  
  // Date filters
  if (dateFilter === 'today') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    where.eventDate = { gte: today, lt: tomorrow }
  } else if (dateFilter === 'next7days') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    where.eventDate = { gte: today, lte: nextWeek }
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      user: true,
      city: true,
      packageCategory: true,
      zoneAssignments: {
        include: { zone: true },
      },
    },
    orderBy: { eventDate: 'asc' },
  })

  const shortenId = (id: string) => id.slice(0, 8).toUpperCase()

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-1">Bookings assigned to your zone</p>
        </div>

        {/* Filters */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <CardTitle>Filters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form method="get" className="flex flex-wrap gap-3">
              <Select name="stage" defaultValue={stageFilter || 'all'}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="PLANNING">Planning</SelectItem>
                  <SelectItem value="PRE_EVENT">Pre-Event</SelectItem>
                  <SelectItem value="EVENT_DAY">Event Day</SelectItem>
                  <SelectItem value="POST_EVENT">Post-Event</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select name="date" defaultValue={dateFilter || 'all'}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="next7days">Next 7 Days</SelectItem>
                </SelectContent>
              </Select>

              <Button type="submit" size="sm">
                Apply Filters
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card className="card-elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>{bookings.length} total bookings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No bookings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookings.map((booking) => (
                      <TableRow 
                        key={booking.id}
                        className="cursor-pointer hover:bg-muted/50"
                        asChild
                      >
                        <Link href={`/ops/bookings/${booking.id}`}>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {shortenId(booking.id)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(booking.eventDate)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm">{booking.city.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StageBadge stage={booking.currentStage} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={booking.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm">{booking.guestCount}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-sm text-primary hover:underline">View →</span>
                          </TableCell>
                        </Link>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}

