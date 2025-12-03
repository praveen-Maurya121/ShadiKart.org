import { requireAdmin } from '@/lib/auth-helpers'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RemoveZoneManagerButton } from '@/components/remove-zone-manager-button'

export default async function AdminLocationsPage() {
  await requireAdmin()

  const [cities, zones, zoneManagers] = await Promise.all([
    prisma.city.findMany({
      orderBy: [{ state: 'asc' }, { name: 'asc' }],
    }),
    prisma.zone.findMany({
      include: {
        zoneManagerProfiles: {
          include: { user: true },
        },
        _count: {
          select: { assignments: true },
        },
      },
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
        <h1 className="text-3xl font-bold">Cities & Zones</h1>
        <p className="text-muted-foreground">Manage cities, zones, and zone managers</p>
      </div>

      {/* Cities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cities ({cities.length})</CardTitle>
            <Link href="/admin/locations/cities/new">
              <Button>Add City</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cities.map((city) => (
              <div
                key={city.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-semibold">
                    {city.name}, {city.state}
                  </p>
                  <p className="text-sm text-muted-foreground">Type: {city.type}</p>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Zones ({zones.length})</CardTitle>
            <Link href="/admin/locations/zones/new">
              <Button>Add Zone</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {zones.map((zone) => (
              <div key={zone.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold">{zone.name}</p>
                    <p className="text-sm text-muted-foreground">{zone.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {zone._count.assignments} bookings assigned
                    </p>
                  </div>
                  <Link href={`/admin/locations/zones/${zone.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-semibold mb-2">Zone Managers:</p>
                  {zone.zoneManagerProfiles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No managers assigned</p>
                  ) : (
                    <div className="space-y-1">
                      {zone.zoneManagerProfiles.map((profile) => (
                        <div
                          key={profile.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <p className="text-sm font-semibold">{profile.user.name}</p>
                            <p className="text-xs text-muted-foreground">{profile.user.email}</p>
                          </div>
                          <RemoveZoneManagerButton profileId={profile.id} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zone Managers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Zone Managers ({zoneManagers.length})</CardTitle>
            <Link href="/admin/locations/zone-managers/new">
              <Button>Add Zone Manager</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {zoneManagers.map((manager) => (
              <div
                key={manager.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-semibold">{manager.name}</p>
                  <p className="text-sm text-muted-foreground">{manager.email}</p>
                  {manager.zoneManagerProfile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Zone: {manager.zoneManagerProfile.zone.name}
                    </p>
                  )}
                </div>
                {manager.zoneManagerProfile && (
                  <RemoveZoneManagerButton profileId={manager.zoneManagerProfile.id} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

