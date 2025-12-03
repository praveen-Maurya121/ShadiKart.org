import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'ZONE_MANAGER'

export interface CurrentUser {
  id: string
  email: string
  name: string
  role: UserRole
  zoneManagerProfileId?: string
  zoneId?: string
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role,
    zoneManagerProfileId: session.user.zoneManagerProfileId,
    zoneId: session.user.zoneId,
  }
}

export async function requireUser(
  role?: UserRole | UserRole[]
): Promise<CurrentUser> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role]
    if (!allowedRoles.includes(user.role)) {
      redirect('/')
    }
  }

  return user
}

export async function requireAdmin(): Promise<CurrentUser> {
  return requireUser('ADMIN')
}

export async function requireZoneManager(): Promise<CurrentUser> {
  const user = await requireUser('ZONE_MANAGER')
  if (!user.zoneId) {
    throw new Error('Zone manager must be assigned to a zone')
  }
  return user
}

