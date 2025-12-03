import { PrismaClient } from '@prisma/client'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

// Helper to generate random token
function generateToken(): string {
  return randomBytes(32).toString('hex')
}

// Helper to get random date in future
function getRandomFutureDate(daysFromNow: number = 30): Date {
  const date = new Date()
  date.setDate(date.getDate() + Math.floor(Math.random() * daysFromNow) + 1)
  date.setHours(10 + Math.floor(Math.random() * 8), 0, 0, 0)
  return date
}

async function main() {
  console.log('🌱 Seeding database with dummy data (excluding users)...\n')

  // ============================================
  // CITIES
  // ============================================
  console.log('📍 Creating cities...')
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

  const bangalore = await prisma.city.upsert({
    where: { id: 'bangalore-1' },
    update: {},
    create: {
      id: 'bangalore-1',
      name: 'Bangalore',
      state: 'Karnataka',
      type: 'METRO',
    },
  })

  const hyderabad = await prisma.city.upsert({
    where: { id: 'hyderabad-1' },
    update: {},
    create: {
      id: 'hyderabad-1',
      name: 'Hyderabad',
      state: 'Telangana',
      type: 'METRO',
    },
  })

  const chennai = await prisma.city.upsert({
    where: { id: 'chennai-1' },
    update: {},
    create: {
      id: 'chennai-1',
      name: 'Chennai',
      state: 'Tamil Nadu',
      type: 'METRO',
    },
  })

  const nagpur = await prisma.city.upsert({
    where: { id: 'nagpur-1' },
    update: {},
    create: {
      id: 'nagpur-1',
      name: 'Nagpur',
      state: 'Maharashtra',
      type: 'TIER2',
    },
  })

  const indore = await prisma.city.upsert({
    where: { id: 'indore-1' },
    update: {},
    create: {
      id: 'indore-1',
      name: 'Indore',
      state: 'Madhya Pradesh',
      type: 'TIER2',
    },
  })

  const jaipur = await prisma.city.upsert({
    where: { id: 'jaipur-1' },
    update: {},
    create: {
      id: 'jaipur-1',
      name: 'Jaipur',
      state: 'Rajasthan',
      type: 'TIER2',
    },
  })

  const surat = await prisma.city.upsert({
    where: { id: 'surat-1' },
    update: {},
    create: {
      id: 'surat-1',
      name: 'Surat',
      state: 'Gujarat',
      type: 'TIER3',
    },
  })

  const cities = [mumbai, delhi, pune, bangalore, hyderabad, chennai, nagpur, indore, jaipur, surat]
  console.log(`✅ Created ${cities.length} cities`)

  // ============================================
  // PACKAGE CATEGORIES
  // ============================================
  console.log('📦 Creating package categories...')
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

  const categories = [ultraHigh, upperMiddlePremium, upperMiddleStandard, lowerMiddle, mass]
  console.log(`✅ Created ${categories.length} package categories`)

  // ============================================
  // PACKAGE PRESETS
  // ============================================
  console.log('🎨 Creating package presets...')
  const cityTypes = ['METRO', 'TIER2', 'TIER3']
  const presets = []

  for (const category of categories) {
    for (const cityType of cityTypes) {
      const basePrice = cityType === 'METRO' 
        ? category.basePriceMetro 
        : cityType === 'TIER2' 
        ? category.basePriceTier2 
        : category.basePriceTier3

      const presetId = `${category.id}-${cityType.toLowerCase()}`
      const preset = await prisma.packagePreset.upsert({
        where: { id: presetId },
        update: {},
        create: {
          id: presetId,
          packageCategoryId: category.id,
          cityType,
          includedServices: JSON.stringify({
            food: cityType === 'METRO' ? 'Premium 5-course menu with live counters' : '4-course menu',
            decor: cityType === 'METRO' ? 'Luxury theme with premium flowers' : 'Elegant theme decoration',
            sound: cityType === 'METRO' ? 'Professional DJ with live band' : 'Professional DJ setup',
            barat: cityType === 'METRO' ? 'Grand band baja with elephants' : 'Band baja',
            photography: cityType === 'METRO' ? '3 photographers + videographer' : '2 photographers + videographer',
            parlour: cityType === 'METRO' ? 'Premium bridal makeup and styling' : 'Premium bridal makeup',
          }),
          basePrice,
        },
      })
      presets.push(preset)
    }
  }
  console.log(`✅ Created ${presets.length} package presets`)

  // ============================================
  // ADD-ONS
  // ============================================
  console.log('➕ Creating add-ons...')
  const addOns = [
    { id: 'addon-drone', name: 'Drone Photography', description: 'Aerial shots of your wedding', priceType: 'PER_EVENT', basePrice: 50000 },
    { id: 'addon-catering', name: 'Extra Catering Counter', description: 'Additional food counter', priceType: 'PER_EVENT', basePrice: 30000 },
    { id: 'addon-band', name: 'Live Band Performance', description: 'Live music performance during reception', priceType: 'PER_EVENT', basePrice: 80000 },
    { id: 'addon-bar', name: 'Premium Bar Setup', description: 'Premium bar with imported drinks', priceType: 'PER_GUEST', basePrice: 500 },
    { id: 'addon-fireworks', name: 'Fireworks Display', description: 'Grand fireworks display', priceType: 'PER_EVENT', basePrice: 100000 },
    { id: 'addon-photobooth', name: 'Photo Booth', description: 'Fun photo booth with props', priceType: 'PER_EVENT', basePrice: 40000 },
    { id: 'addon-mehndi', name: 'Mehndi Artist', description: 'Professional mehndi artist', priceType: 'PER_EVENT', basePrice: 25000 },
    { id: 'addon-henna', name: 'Henna Decoration', description: 'Beautiful henna decoration setup', priceType: 'PER_EVENT', basePrice: 20000 },
    { id: 'addon-videography', name: 'Cinematic Videography', description: 'Professional cinematic video production', priceType: 'PER_EVENT', basePrice: 150000 },
    { id: 'addon-sangam', name: 'Sangam Setup', description: 'Traditional sangam decoration', priceType: 'PER_EVENT', basePrice: 35000 },
  ]

  for (const addOn of addOns) {
    await prisma.addOn.upsert({
      where: { id: addOn.id },
      update: {},
      create: addOn,
    })
  }
  console.log(`✅ Created ${addOns.length} add-ons`)

  // ============================================
  // ZONES
  // ============================================
  console.log('🗺️  Creating zones...')
  const zones = [
    { id: 'zone-1', name: 'Mumbai Zone', description: 'Mumbai and surrounding areas' },
    { id: 'zone-2', name: 'Delhi Zone', description: 'Delhi NCR region' },
    { id: 'zone-3', name: 'Pune Zone', description: 'Pune and surrounding areas' },
    { id: 'zone-4', name: 'South Zone', description: 'Bangalore, Chennai, Hyderabad' },
    { id: 'zone-5', name: 'West Zone', description: 'Gujarat and Rajasthan' },
  ]

  for (const zone of zones) {
    await prisma.zone.upsert({
      where: { id: zone.id },
      update: {},
      create: zone,
    })
  }
  console.log(`✅ Created ${zones.length} zones`)

  // ============================================
  // GET EXISTING USERS (for bookings)
  // ============================================
  console.log('👤 Fetching existing users...')
  const customer = await prisma.user.findUnique({ where: { email: 'customer@shadikart.com' } })
  const admin = await prisma.user.findUnique({ where: { email: 'admin@shadikart.com' } })
  const zoneManager = await prisma.user.findUnique({ 
    where: { email: 'manager1@shadikart.com' },
    include: { zoneManagerProfile: true },
  })

  if (!customer) {
    console.log('⚠️  Customer user not found. Please run: npm run db:create-test-users')
    return
  }

  // ============================================
  // BOOKINGS
  // ============================================
  console.log('📅 Creating bookings...')
  const bookingStatuses = ['DRAFT', 'PENDING_PAYMENT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
  const bookingStages = ['PLANNING', 'PRE_EVENT', 'EVENT_DAY', 'POST_EVENT']
  const bookings = []

  // Create bookings with various statuses
  for (let i = 0; i < 15; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)]
    const category = categories[Math.floor(Math.random() * categories.length)]
    const cityType = city.type
    const preset = presets.find(p => p.packageCategoryId === category.id && p.cityType === cityType)
    
    const status = bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)]
    const stage = status === 'COMPLETED' 
      ? 'POST_EVENT' 
      : status === 'IN_PROGRESS' 
      ? bookingStages[Math.floor(Math.random() * bookingStages.length)]
      : status === 'CONFIRMED' 
      ? 'PLANNING'
      : 'PLANNING'

    const guestCount = Math.floor(Math.random() * (category.defaultGuestRangeMax - category.defaultGuestRangeMin + 1)) + category.defaultGuestRangeMin
    const basePrice = cityType === 'METRO' ? category.basePriceMetro : cityType === 'TIER2' ? category.basePriceTier2 : category.basePriceTier3
    const totalPrice = basePrice + (guestCount - category.defaultGuestRangeMin) * 1000

    const booking = await prisma.booking.create({
      data: {
        userId: customer.id,
        packageCategoryId: category.id,
        packagePresetId: preset?.id,
        cityId: city.id,
        eventDate: getRandomFutureDate(90),
        guestCount,
        totalPrice,
        status,
        currentStage: stage,
        aiRecommendationSummary: `AI recommended ${category.name} package for ${guestCount} guests in ${city.name}. Perfect for a ${cityType} city wedding.`,
      },
    })
    bookings.push(booking)
  }
  console.log(`✅ Created ${bookings.length} bookings`)

  // ============================================
  // ZONE ASSIGNMENTS
  // ============================================
  console.log('📍 Creating zone assignments...')
  const zoneList = await prisma.zone.findMany()
  
  for (const booking of bookings.filter(b => ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(b.status))) {
    const zone = zoneList[Math.floor(Math.random() * zoneList.length)]
    await prisma.zoneAssignment.create({
      data: {
        bookingId: booking.id,
        zoneId: zone.id,
        status: booking.status === 'COMPLETED' ? 'COMPLETED' : booking.status === 'IN_PROGRESS' ? 'ASSIGNED' : 'PENDING',
      },
    })
  }
  console.log(`✅ Created zone assignments for confirmed bookings`)

  // ============================================
  // GUESTS
  // ============================================
  console.log('👥 Creating guests...')
  const guestStatuses = ['INVITED', 'CONFIRMED', 'DECLINED', 'ATTENDED']
  const guestNames = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh',
    'Anjali Mehta', 'Rahul Gupta', 'Kavita Joshi', 'Suresh Iyer', 'Deepa Nair',
    'Manoj Desai', 'Sunita Rao', 'Arjun Malhotra', 'Neha Agarwal', 'Kiran Shah',
  ]

  for (const booking of bookings.filter(b => ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(b.status))) {
    const numGuests = Math.min(booking.guestCount, Math.floor(Math.random() * 10) + 5)
    for (let i = 0; i < numGuests; i++) {
      const name = guestNames[Math.floor(Math.random() * guestNames.length)]
      const status = booking.status === 'COMPLETED' 
        ? guestStatuses[Math.floor(Math.random() * guestStatuses.length)]
        : guestStatuses[Math.floor(Math.random() * 3)] // INVITED, CONFIRMED, DECLINED

      await prisma.guest.create({
        data: {
          bookingId: booking.id,
          name: `${name} ${i + 1}`,
          phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          email: `${name.toLowerCase().replace(' ', '.')}${i}@example.com`,
          status,
          inviteToken: generateToken(),
        },
      })
    }
  }
  console.log(`✅ Created guests for bookings`)

  // ============================================
  // ADD-ONS FOR BOOKINGS
  // ============================================
  console.log('➕ Adding add-ons to bookings...')
  const allAddOns = await prisma.addOn.findMany()
  
  for (const booking of bookings.filter(b => ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(b.status))) {
    const numAddOns = Math.floor(Math.random() * 3) + 1
    const selectedAddOns = allAddOns.sort(() => 0.5 - Math.random()).slice(0, numAddOns)
    
    for (const addOn of selectedAddOns) {
      const quantity = addOn.priceType === 'PER_GUEST' ? booking.guestCount : 1
      const price = addOn.basePrice * quantity

      await prisma.bookingAddOn.create({
        data: {
          bookingId: booking.id,
          addOnId: addOn.id,
          quantity,
          price,
        },
      })
    }
  }
  console.log(`✅ Added add-ons to bookings`)

  // ============================================
  // CHAT MESSAGES
  // ============================================
  console.log('💬 Creating chat messages...')
  const messages = [
    'Hello! I have a question about my booking.',
    'When will the decorations be set up?',
    'Can we add more guests to the list?',
    'What time should we arrive for the event?',
    'Thank you for the excellent service!',
    'Is parking available at the venue?',
    'Can we customize the menu?',
    'What is the dress code?',
  ]

  for (const booking of bookings.filter(b => ['CONFIRMED', 'IN_PROGRESS'].includes(b.status))) {
    const numMessages = Math.floor(Math.random() * 5) + 2
    for (let i = 0; i < numMessages; i++) {
      const isSystem = Math.random() > 0.7
      const senderType = isSystem ? 'SYSTEM' : Math.random() > 0.5 ? 'USER' : 'ZONE_MANAGER'
      
      await prisma.chatMessage.create({
        data: {
          bookingId: booking.id,
          senderId: isSystem ? null : (senderType === 'USER' ? customer.id : zoneManager?.id || null),
          senderType,
          message: messages[Math.floor(Math.random() * messages.length)],
          createdAt: new Date(Date.now() - (numMessages - i) * 3600000), // Stagger messages
        },
      })
    }
  }
  console.log(`✅ Created chat messages`)

  // ============================================
  // ISSUES
  // ============================================
  console.log('🚨 Creating issues...')
  const issueTitles = [
    'Venue booking confirmation needed',
    'Catering menu change request',
    'Photography timing issue',
    'Decoration color preference',
    'Guest list update required',
    'Payment query',
    'Transportation arrangement',
  ]

  const issueDescriptions = [
    'Need to confirm the venue booking details',
    'Would like to modify the catering menu',
    'Photography timing needs adjustment',
    'Want to change decoration color scheme',
    'Need to add more guests to the list',
    'Have a question about payment schedule',
    'Need help with transportation arrangements',
  ]

  const issueStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
  const issuePriorities = ['LOW', 'MEDIUM', 'HIGH']

  for (const booking of bookings.filter(b => ['CONFIRMED', 'IN_PROGRESS'].includes(b.status))) {
    if (Math.random() > 0.6) { // 40% chance of having an issue
      const index = Math.floor(Math.random() * issueTitles.length)
      await prisma.issue.create({
        data: {
          bookingId: booking.id,
          userId: customer.id,
          zoneManagerId: zoneManager?.id || null,
          title: issueTitles[index],
          description: issueDescriptions[index],
          status: issueStatuses[Math.floor(Math.random() * issueStatuses.length)],
          priority: issuePriorities[Math.floor(Math.random() * issuePriorities.length)],
        },
      })
    }
  }
  console.log(`✅ Created issues`)

  // ============================================
  // LIVE STREAMS
  // ============================================
  console.log('📺 Creating live streams...')
  const platforms = ['YOUTUBE', 'ZOOM', 'INSTAGRAM', 'OTHER']
  const streamUrls = [
    'https://youtube.com/watch?v=example1',
    'https://zoom.us/j/example1',
    'https://instagram.com/live/example1',
    'https://custom-platform.com/stream1',
  ]

  for (const booking of bookings.filter(b => ['IN_PROGRESS', 'COMPLETED'].includes(b.status))) {
    if (Math.random() > 0.5) {
      const platformIndex = Math.floor(Math.random() * platforms.length)
      await prisma.liveStream.create({
        data: {
          bookingId: booking.id,
          platform: platforms[platformIndex],
          url: streamUrls[platformIndex],
          isActive: booking.status === 'IN_PROGRESS',
        },
      })
    }
  }
  console.log(`✅ Created live streams`)

  // ============================================
  // MEDIA ASSETS
  // ============================================
  console.log('📸 Creating media assets...')
  const mediaTypes = ['PHOTO', 'VIDEO', 'OTHER']
  const mediaLabels = [
    'Wedding Ceremony',
    'Reception',
    'Bridal Entry',
    'Groom Entry',
    'First Dance',
    'Family Photos',
    'Candid Moments',
  ]

  for (const booking of bookings.filter(b => b.status === 'COMPLETED')) {
    const numAssets = Math.floor(Math.random() * 10) + 5
    for (let i = 0; i < numAssets; i++) {
      await prisma.mediaAsset.create({
        data: {
          bookingId: booking.id,
          url: `https://example.com/media/${booking.id}/${i + 1}.jpg`,
          type: mediaTypes[Math.floor(Math.random() * mediaTypes.length)],
          label: mediaLabels[Math.floor(Math.random() * mediaLabels.length)],
        },
      })
    }
  }
  console.log(`✅ Created media assets`)

  // ============================================
  // RATINGS
  // ============================================
  console.log('⭐ Creating ratings...')
  for (const booking of bookings.filter(b => b.status === 'COMPLETED')) {
    if (Math.random() > 0.3) { // 70% chance of rating
      await prisma.rating.create({
        data: {
          bookingId: booking.id,
          userId: customer.id,
          overallScore: Math.floor(Math.random() * 2) + 4, // 4 or 5
          foodScore: Math.floor(Math.random() * 2) + 4,
          decorScore: Math.floor(Math.random() * 2) + 4,
          experienceScore: Math.floor(Math.random() * 2) + 4,
          comments: 'Great experience! Everything was perfect.',
        },
      })
    }
  }
  console.log(`✅ Created ratings`)

  // ============================================
  // PLANNER CONFIGS
  // ============================================
  console.log('⚙️  Creating planner configs...')
  const plannerConfigs = [
    { key: 'style_multiplier_trendy', value: '1.2', scope: 'GLOBAL' },
    { key: 'style_multiplier_traditional', value: '1.0', scope: 'GLOBAL' },
    { key: 'style_multiplier_minimalist', value: '0.9', scope: 'GLOBAL' },
    { key: 'guest_factor_base', value: '1000', scope: 'GLOBAL' },
    { key: 'guest_factor_premium', value: '1500', scope: 'GLOBAL' },
    { key: 'city_multiplier_metro', value: '1.0', scope: 'GLOBAL' },
    { key: 'city_multiplier_tier2', value: '0.75', scope: 'GLOBAL' },
    { key: 'city_multiplier_tier3', value: '0.6', scope: 'GLOBAL' },
  ]

  for (const config of plannerConfigs) {
    await prisma.plannerConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    })
  }
  console.log(`✅ Created ${plannerConfigs.length} planner configs`)

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n✅ Seed data created successfully!')
  console.log('\n📊 Summary:')
  console.log(`   Cities: ${cities.length}`)
  console.log(`   Package Categories: ${categories.length}`)
  console.log(`   Package Presets: ${presets.length}`)
  console.log(`   Add-ons: ${addOns.length}`)
  console.log(`   Zones: ${zones.length}`)
  console.log(`   Bookings: ${bookings.length}`)
  console.log(`   Guests: Created for bookings`)
  console.log(`   Zone Assignments: Created for confirmed bookings`)
  console.log(`   Chat Messages: Created for active bookings`)
  console.log(`   Issues: Created for some bookings`)
  console.log(`   Live Streams: Created for in-progress bookings`)
  console.log(`   Media Assets: Created for completed bookings`)
  console.log(`   Ratings: Created for completed bookings`)
  console.log(`   Planner Configs: ${plannerConfigs.length}`)
  console.log('\n💡 Note: User data was not created. Run "npm run db:create-test-users" to create test users.\n')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
