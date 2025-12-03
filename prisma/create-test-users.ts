import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Creating test users...\n')

  // 1. Create Customer
  const customerEmail = 'customer@shadikart.com'
  const customerPassword = 'customer123'
  const customerPasswordHash = await hash(customerPassword, 12)

  const existingCustomer = await prisma.user.findUnique({
    where: { email: customerEmail },
  })

  if (existingCustomer) {
    await prisma.user.update({
      where: { email: customerEmail },
      data: {
        passwordHash: customerPasswordHash,
        role: 'CUSTOMER',
        name: 'Test Customer',
      },
    })
    console.log(`✅ Updated customer: ${customerEmail}`)
  } else {
    await prisma.user.create({
      data: {
        email: customerEmail,
        passwordHash: customerPasswordHash,
        name: 'Test Customer',
        role: 'CUSTOMER',
      },
    })
    console.log(`✅ Created customer: ${customerEmail} / ${customerPassword}`)
  }

  // 2. Create Admin
  const adminEmail = 'admin@shadikart.com'
  const adminPassword = 'admin123'
  const adminPasswordHash = await hash(adminPassword, 12)

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (existingAdmin) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        name: 'Admin User',
      },
    })
    console.log(`✅ Updated admin: ${adminEmail}`)
  } else {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: adminPasswordHash,
        name: 'Admin User',
        role: 'ADMIN',
      },
    })
    console.log(`✅ Created admin: ${adminEmail} / ${adminPassword}`)
  }

  // 3. Create Zone Manager (requires a zone to exist)
  const managerEmail = 'manager1@shadikart.com'
  const managerPassword = 'manager123'
  const managerPasswordHash = await hash(managerPassword, 12)

  // First, check if any zone exists, if not create one
  let zone = await prisma.zone.findFirst()

  if (!zone) {
    console.log('⚠️  No zone found. Creating a default zone...')
    zone = await prisma.zone.create({
      data: {
        name: 'Default Zone',
        description: 'Default zone for testing',
      },
    })
    console.log(`✅ Created zone: ${zone.name} (ID: ${zone.id})`)
  }

  const existingManager = await prisma.user.findUnique({
    where: { email: managerEmail },
    include: { zoneManagerProfile: true },
  })

  if (existingManager) {
    // Update user
    await prisma.user.update({
      where: { email: managerEmail },
      data: {
        passwordHash: managerPasswordHash,
        role: 'ZONE_MANAGER',
        name: 'Zone Manager 1',
      },
    })

    // Update or create zone manager profile
    if (existingManager.zoneManagerProfile) {
      await prisma.zoneManagerProfile.update({
        where: { userId: existingManager.id },
        data: { zoneId: zone.id },
      })
      console.log(`✅ Updated zone manager profile for ${managerEmail}`)
    } else {
      await prisma.zoneManagerProfile.create({
        data: {
          userId: existingManager.id,
          zoneId: zone.id,
        },
      })
      console.log(`✅ Created zone manager profile for ${managerEmail}`)
    }
    console.log(`✅ Updated zone manager: ${managerEmail}`)
  } else {
    // Create new zone manager with profile
    await prisma.user.create({
      data: {
        email: managerEmail,
        passwordHash: managerPasswordHash,
        name: 'Zone Manager 1',
        role: 'ZONE_MANAGER',
        zoneManagerProfile: {
          create: {
            zoneId: zone.id,
          },
        },
      },
    })
    console.log(`✅ Created zone manager: ${managerEmail} / ${managerPassword}`)
    console.log(`   Assigned to zone: ${zone.name} (ID: ${zone.id})`)
  }

  console.log('\n✅ All test users created successfully!')
  console.log('\n📋 Login Credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Customer:')
  console.log(`  Email: ${customerEmail}`)
  console.log(`  Password: ${customerPassword}`)
  console.log(`  Redirects to: /bookings`)
  console.log('\nAdmin:')
  console.log(`  Email: ${adminEmail}`)
  console.log(`  Password: ${adminPassword}`)
  console.log(`  Redirects to: /admin`)
  console.log('\nZone Manager:')
  console.log(`  Email: ${managerEmail}`)
  console.log(`  Password: ${managerPassword}`)
  console.log(`  Redirects to: /ops`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch((e) => {
    console.error('❌ Error creating test users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
