import { requireZoneManager } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { OpsSidebar } from '@/components/ops/ops-sidebar'
import { OpsHeader } from '@/components/ops/ops-header'
import { Providers } from '@/app/providers'

export default async function OpsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user
  try {
    user = await requireZoneManager()
  } catch {
    redirect('/')
  }

  // Get zone manager profile to show zone name
  const zoneManager = await prisma.zoneManagerProfile.findUnique({
    where: { userId: user.id },
    include: { zone: true },
  })

  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          <OpsSidebar zoneName={zoneManager?.zone.name} />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:pl-64">
            {/* Header */}
            <OpsHeader />

            {/* Page Content */}
            <main className="flex-1 overflow-auto">
              <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Providers>
  )
}

