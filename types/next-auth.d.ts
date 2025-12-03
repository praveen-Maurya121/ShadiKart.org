import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: "CUSTOMER" | "ADMIN" | "ZONE_MANAGER"
      zoneManagerProfileId?: string
      zoneId?: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: "CUSTOMER" | "ADMIN" | "ZONE_MANAGER"
    zoneManagerProfileId?: string
    zoneId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "CUSTOMER" | "ADMIN" | "ZONE_MANAGER"
    zoneManagerProfileId?: string
    zoneId?: string
  }
}

