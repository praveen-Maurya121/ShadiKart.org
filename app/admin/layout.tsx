import { requireAdmin } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { Providers } from '@/app/providers'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    await requireAdmin()
  } catch {
    redirect('/')
  }

  return (
    <Providers>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <AdminHeader />

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </Providers>
  )
}

