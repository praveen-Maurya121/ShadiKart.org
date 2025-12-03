import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

export default async function AdminAddonsPage() {
  await requireAdmin()

  const addons = await prisma.addOn.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { bookingAddOns: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add-ons Management</h1>
          <p className="text-muted-foreground">Manage add-on services</p>
        </div>
        <Link href="/admin/addons/new">
          <Button>Create New Add-on</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Add-ons ({addons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {addons.length === 0 ? (
            <p className="text-muted-foreground">No add-ons found.</p>
          ) : (
            <div className="space-y-2">
              {addons.map((addon) => (
                <div
                  key={addon.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <p className="font-semibold">{addon.name}</p>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          addon.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {addon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {addon.description}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Price Type</p>
                        <p className="text-sm font-semibold">{addon.priceType.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Base Price</p>
                        <p className="text-sm font-semibold">{formatCurrency(addon.basePrice)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Used in Bookings</p>
                        <p className="text-sm font-semibold">{addon._count.bookingAddOns}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/addons/${addon.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

