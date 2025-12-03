import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4]
  const zoneId = process.argv[5]

  if (!email || !password || !name || !zoneId) {
    console.error('Usage: tsx prisma/create-zone-manager.ts <email> <password> <name> <zoneId>')
    process.exit(1)
  }

  const passwordHash = await hash(password, 12)

  // Check if zone exists
  const zone = await prisma.zone.findUnique({
    where: { id: zoneId },
  })

  if (!zone) {
    console.error(`❌ Zone ${zoneId} not found`)
    process.exit(1)
  }

  // Check if user exists
  const existing = await prisma.user.findUnique({
    where: { email },
    include: { zoneManagerProfile: true },
  })

  if (existing) {
    if (existing.role !== 'ZONE_MANAGER') {
      await prisma.user.update({
        where: { email },
        data: { role: 'ZONE_MANAGER' },
      })
    }

    if (existing.zoneManagerProfile) {
      // Update existing profile
      await prisma.zoneManagerProfile.update({
        where: { userId: existing.id },
        data: { zoneId },
      })
      console.log(`✅ Updated zone manager profile for ${email}`)
    } else {
      // Create profile
      await prisma.zoneManagerProfile.create({
        data: {
          userId: existing.id,
          zoneId,
        },
      })
      console.log(`✅ Created zone manager profile for ${email}`)
    }
  } else {
    // Create new user and profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'ZONE_MANAGER',
        zoneManagerProfile: {
          create: {
            zoneId,
          },
        },
      },
    })
    console.log(`✅ Created zone manager: ${email} assigned to zone: ${zone.name}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

