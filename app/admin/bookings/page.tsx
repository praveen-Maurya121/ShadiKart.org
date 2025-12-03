import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/admin/status-badge'
import { StageBadge } from '@/components/admin/stage-badge'
import { PageWrapper } from '@/components/admin/page-wrapper'
import { MapPin, Filter } from 'lucide-react'

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const cityFilter = searchParams.city as string | undefined
  const statusFilter = searchParams.status as string | undefined
  const dateFrom = searchParams.dateFrom as string | undefined
  const dateTo = searchParams.dateTo as string | undefined

  const where: any = {}
  if (cityFilter && cityFilter !== 'all') where.cityId = cityFilter
  if (statusFilter && statusFilter !== 'all') where.status = statusFilter
  if (dateFrom || dateTo) {
    where.eventDate = {}
    if (dateFrom) where.eventDate.gte = new Date(dateFrom)
    if (dateTo) where.eventDate.lte = new Date(dateTo)
  }

  const [bookings, cities] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        user: true,
        city: true,
        packageCategory: true,
        zoneAssignments: {
          include: { zone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.city.findMany(),
  ])

  const shortenId = (id: string) => id.slice(0, 8).toUpperCase()

  return (
    <PageWrapper>
      <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">Bookings Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all bookings</p>
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
          <form method="get" className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select name="city" defaultValue={cityFilter || 'all'}>
              <SelectTrigger>
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select name="status" defaultValue={statusFilter || 'all'}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Input
              name="dateFrom"
              type="date"
              placeholder="From Date"
              defaultValue={dateFrom}
              className="w-full"
            />
            <Input
              name="dateTo"
              type="date"
              placeholder="To Date"
              defaultValue={dateTo}
              className="w-full"
            />

            <Button type="submit" className="w-full">
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
                  <TableHead>Customer</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                      <Link href={`/admin/bookings/${booking.id}`}>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {shortenId(booking.id)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {booking.user.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{booking.city.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(booking.eventDate)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={booking.status} />
                        </TableCell>
                        <TableCell>
                          <StageBadge stage={booking.currentStage} />
                        </TableCell>
                        <TableCell>
                          {booking.zoneAssignments.length > 0 ? (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm">
                                {booking.zoneAssignments[0].zone.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {formatCurrency(booking.totalPrice)}
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

