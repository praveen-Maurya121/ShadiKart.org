import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

export default async function AdminPackagesPage() {
  await requireAdmin()

  const categories = await prisma.packageCategory.findMany({
    include: {
      presets: true,
      _count: {
        select: { bookings: true },
      },
    },
    orderBy: { basePriceMetro: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Package Management</h1>
          <p className="text-muted-foreground">Manage package categories and presets</p>
        </div>
        <Link href="/admin/packages/new">
          <Button>Create New Category</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{category.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Bookings</p>
                  <p className="text-2xl font-bold">{category._count.bookings}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Metro</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(category.basePriceMetro)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tier 2</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(category.basePriceTier2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tier 3</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(category.basePriceTier3)}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Guest Range</p>
                <p className="font-semibold">
                  {category.defaultGuestRangeMin} - {category.defaultGuestRangeMax} guests
                </p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Presets ({category.presets.length})</p>
                <div className="space-y-2">
                  {category.presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="font-semibold">{preset.cityType}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(preset.basePrice)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/packages/${category.id}`}>
                  <Button variant="outline">Edit Category</Button>
                </Link>
                <Link href={`/admin/packages/${category.id}/presets/new`}>
                  <Button variant="outline">Add Preset</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

