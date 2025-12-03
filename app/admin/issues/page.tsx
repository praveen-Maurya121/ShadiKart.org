import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export default async function AdminIssuesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  await requireAdmin()
  
  const statusFilter = searchParams.status as string | undefined

  const where: any = {}
  if (statusFilter) where.status = statusFilter

  const [issues, zoneManagers] = await Promise.all([
    prisma.issue.findMany({
      where,
      include: {
        booking: {
          include: {
            user: true,
            city: true,
          },
        },
        reporter: true,
        assignee: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findMany({
      where: { role: 'ZONE_MANAGER' },
      include: {
        zoneManagerProfile: {
          include: { zone: true },
        },
      },
    }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Issues / Support</h1>
        <p className="text-muted-foreground">Manage customer issues and support tickets</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="get" className="flex gap-4">
            <select
              name="status"
              defaultValue={statusFilter}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            <button
              type="submit"
              className="h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-600"
            >
              Apply Filter
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle>All Issues ({issues.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {issues.map((issue) => (
              <Link
                key={issue.id}
                href={`/admin/issues/${issue.id}`}
                className="block"
              >
                <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <p className="font-semibold">{issue.title}</p>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          issue.status === 'OPEN'
                            ? 'bg-red-100 text-red-800'
                            : issue.status === 'IN_PROGRESS'
                            ? 'bg-yellow-100 text-yellow-800'
                            : issue.status === 'RESOLVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {issue.status.replace('_', ' ')}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          issue.priority === 'HIGH'
                            ? 'bg-red-100 text-red-800'
                            : issue.priority === 'MEDIUM'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {issue.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {issue.description.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Booking: {issue.booking.user.name} • {issue.booking.city.name} •{' '}
                      {formatDate(issue.booking.eventDate)}
                    </p>
                    {issue.assignee && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Assigned to: {issue.assignee.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(issue.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

