import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create cities
  const mumbai = await prisma.city.upsert({
    where: { id: 'mumbai-1' },
    update: {},
    create: {
      id: 'mumbai-1',
      name: 'Mumbai',
      state: 'Maharashtra',
      type: 'METRO',
    },
  })

  const delhi = await prisma.city.upsert({
    where: { id: 'delhi-1' },
    update: {},
    create: {
      id: 'delhi-1',
      name: 'Delhi',
      state: 'Delhi',
      type: 'METRO',
    },
  })

  const pune = await prisma.city.upsert({
    where: { id: 'pune-1' },
    update: {},
    create: {
      id: 'pune-1',
      name: 'Pune',
      state: 'Maharashtra',
      type: 'TIER2',
    },
  })

  // Create package categories
  const ultraHigh = await prisma.packageCategory.upsert({
    where: { id: 'ultra-high' },
    update: {},
    create: {
      id: 'ultra-high',
      name: 'Ultra High',
      description: 'Luxury beyond compare with premium services',
      basePriceMetro: 2000000,
      basePriceTier2: 1500000,
      basePriceTier3: 1200000,
      defaultGuestRangeMin: 200,
      defaultGuestRangeMax: 500,
    },
  })

  const upperMiddlePremium = await prisma.packageCategory.upsert({
    where: { id: 'upper-middle-premium' },
    update: {},
    create: {
      id: 'upper-middle-premium',
      name: 'Upper Middle Premium',
      description: 'Premium elegance with high-end services',
      basePriceMetro: 1200000,
      basePriceTier2: 900000,
      basePriceTier3: 700000,
      defaultGuestRangeMin: 150,
      defaultGuestRangeMax: 300,
    },
  })

  const upperMiddleStandard = await prisma.packageCategory.upsert({
    where: { id: 'upper-middle-standard' },
    update: {},
    create: {
      id: 'upper-middle-standard',
      name: 'Upper Middle Standard',
      description: 'Refined sophistication at a great value',
      basePriceMetro: 800000,
      basePriceTier2: 600000,
      basePriceTier3: 500000,
      defaultGuestRangeMin: 100,
      defaultGuestRangeMax: 250,
    },
  })

  const lowerMiddle = await prisma.packageCategory.upsert({
    where: { id: 'lower-middle' },
    update: {},
    create: {
      id: 'lower-middle',
      name: 'Lower Middle',
      description: 'Beautiful and affordable packages',
      basePriceMetro: 500000,
      basePriceTier2: 400000,
      basePriceTier3: 300000,
      defaultGuestRangeMin: 50,
      defaultGuestRangeMax: 150,
    },
  })

  const mass = await prisma.packageCategory.upsert({
    where: { id: 'mass' },
    update: {},
    create: {
      id: 'mass',
      name: 'Mass',
      description: 'Value for everyone with essential services',
      basePriceMetro: 300000,
      basePriceTier2: 250000,
      basePriceTier3: 200000,
      defaultGuestRangeMin: 30,
      defaultGuestRangeMax: 100,
    },
  })

  // Create presets
  await prisma.packagePreset.upsert({
    where: { id: 'ultra-high-metro' },
    update: {},
    create: {
      id: 'ultra-high-metro',
      packageCategoryId: ultraHigh.id,
      cityType: 'METRO',
      includedServices: JSON.stringify({
        food: 'Premium 5-course menu with live counters',
        decor: 'Luxury theme with premium flowers',
        sound: 'Professional DJ with live band',
        barat: 'Grand band baja with elephants',
        photography: '3 photographers + videographer',
        parlour: 'Premium bridal makeup and styling',
      }),
      basePrice: 2000000,
    },
  })

  await prisma.packagePreset.upsert({
    where: { id: 'upper-middle-premium-metro' },
    update: {},
    create: {
      id: 'upper-middle-premium-metro',
      packageCategoryId: upperMiddlePremium.id,
      cityType: 'METRO',
      includedServices: JSON.stringify({
        food: 'Premium 4-course menu',
        decor: 'Elegant theme decoration',
        sound: 'Professional DJ setup',
        barat: 'Band baja',
        photography: '2 photographers + videographer',
        parlour: 'Premium bridal makeup',
      }),
      basePrice: 1200000,
    },
  })

  // Create add-ons
  await prisma.addOn.upsert({
    where: { id: 'addon-drone' },
    update: {},
    create: {
      id: 'addon-drone',
      name: 'Drone Photography',
      description: 'Aerial shots of your wedding',
      priceType: 'PER_EVENT',
      basePrice: 50000,
    },
  })

  await prisma.addOn.upsert({
    where: { id: 'addon-catering' },
    update: {},
    create: {
      id: 'addon-catering',
      name: 'Extra Catering Counter',
      description: 'Additional food counter',
      priceType: 'PER_EVENT',
      basePrice: 30000,
    },
  })

  await prisma.addOn.upsert({
    where: { id: 'addon-band' },
    update: {},
    create: {
      id: 'addon-band',
      name: 'Live Band Performance',
      description: 'Live music performance during reception',
      priceType: 'PER_EVENT',
      basePrice: 80000,
    },
  })

  await prisma.addOn.upsert({
    where: { id: 'addon-bar' },
    update: {},
    create: {
      id: 'addon-bar',
      name: 'Premium Bar Setup',
      description: 'Premium bar with imported drinks',
      priceType: 'PER_GUEST',
      basePrice: 500,
    },
  })

  await prisma.addOn.upsert({
    where: { id: 'addon-fireworks' },
    update: {},
    create: {
      id: 'addon-fireworks',
      name: 'Fireworks Display',
      description: 'Grand fireworks display',
      priceType: 'PER_EVENT',
      basePrice: 100000,
    },
  })

  // Create zones
  await prisma.zone.upsert({
    where: { id: 'zone-1' },
    update: {},
    create: {
      id: 'zone-1',
      name: 'Mumbai Zone',
      description: 'Mumbai and surrounding areas',
    },
  })

  await prisma.zone.upsert({
    where: { id: 'zone-2' },
    update: {},
    create: {
      id: 'zone-2',
      name: 'Delhi Zone',
      description: 'Delhi NCR region',
    },
  })

  const puneZone = await prisma.zone.upsert({
    where: { id: 'zone-3' },
    update: {},
    create: {
      id: 'zone-3',
      name: 'Pune Zone',
      description: 'Pune and surrounding areas',
    },
  })

  // Create test users
  const adminPasswordHash = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shadikart.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@shadikart.com',
      passwordHash: adminPasswordHash,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  const customerPasswordHash = await hash('customer123', 12)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@shadikart.com' },
    update: { role: 'CUSTOMER' },
    create: {
      email: 'customer@shadikart.com',
      passwordHash: customerPasswordHash,
      name: 'Test Customer',
      role: 'CUSTOMER',
      phone: '+91 9876543210',
    },
  })

  const zoneManager1PasswordHash = await hash('manager123', 12)
  const zoneManager1 = await prisma.user.upsert({
    where: { email: 'manager1@shadikart.com' },
    update: { role: 'ZONE_MANAGER' },
    create: {
      email: 'manager1@shadikart.com',
      passwordHash: zoneManager1PasswordHash,
      name: 'Mumbai Zone Manager',
      role: 'ZONE_MANAGER',
      phone: '+91 9876543211',
    },
  })

  const zoneManager2PasswordHash = await hash('manager123', 12)
  const zoneManager2 = await prisma.user.upsert({
    where: { email: 'manager2@shadikart.com' },
    update: { role: 'ZONE_MANAGER' },
    create: {
      email: 'manager2@shadikart.com',
      passwordHash: zoneManager2PasswordHash,
      name: 'Delhi Zone Manager',
      role: 'ZONE_MANAGER',
      phone: '+91 9876543212',
    },
  })

  // Create zone manager profiles
  await prisma.zoneManagerProfile.upsert({
    where: { userId: zoneManager1.id },
    update: {},
    create: {
      userId: zoneManager1.id,
      zoneId: 'zone-1', // Mumbai Zone
      phone: '+91 9876543211',
      isActive: true,
    },
  })

  await prisma.zoneManagerProfile.upsert({
    where: { userId: zoneManager2.id },
    update: {},
    create: {
      userId: zoneManager2.id,
      zoneId: 'zone-2', // Delhi Zone
      phone: '+91 9876543212',
      isActive: true,
    },
  })

  console.log('✅ Seed data created successfully!')
  console.log('\n📋 Test Users Created:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('👤 ADMIN:')
  console.log('   Email: admin@shadikart.com')
  console.log('   Password: admin123')
  console.log('\n👤 CUSTOMER:')
  console.log('   Email: customer@shadikart.com')
  console.log('   Password: customer123')
  console.log('\n👤 ZONE MANAGER 1 (Mumbai):')
  console.log('   Email: manager1@shadikart.com')
  console.log('   Password: manager123')
  console.log('\n👤 ZONE MANAGER 2 (Delhi):')
  console.log('   Email: manager2@shadikart.com')
  console.log('   Password: manager123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

