import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await verifyUser(credentials.email, credentials.password)
        if (!user) return null

        // Get zone manager profile if exists
        const zoneManagerProfile = user.role === 'ZONE_MANAGER'
          ? await prisma.zoneManagerProfile.findUnique({
              where: { userId: user.id },
              include: { zone: true },
            })
          : null

        // Ensure role is set (default to CUSTOMER if not set)
        const userRole = (user.role || 'CUSTOMER') as 'CUSTOMER' | 'ADMIN' | 'ZONE_MANAGER'

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: userRole,
          zoneManagerProfileId: zoneManagerProfile?.id,
          zoneId: zoneManagerProfile?.zoneId,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.zoneManagerProfileId = user.zoneManagerProfileId
        token.zoneId = user.zoneId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'CUSTOMER' | 'ADMIN' | 'ZONE_MANAGER'
        session.user.zoneManagerProfileId = token.zoneManagerProfileId
        session.user.zoneId = token.zoneId
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

