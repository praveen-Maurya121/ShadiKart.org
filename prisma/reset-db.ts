import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetDatabase() {
  try {
    console.log('🗑️  Deleting all data...')
    
    // Delete in order to respect foreign key constraints
    await prisma.rating.deleteMany()
    await prisma.chatMessage.deleteMany()
    await prisma.mediaAsset.deleteMany()
    await prisma.liveStream.deleteMany()
    await prisma.guest.deleteMany()
    await prisma.bookingAddOn.deleteMany()
    await prisma.zoneAssignment.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.user.deleteMany()
    await prisma.addOn.deleteMany()
    await prisma.packagePreset.deleteMany()
    await prisma.packageCategory.deleteMany()
    await prisma.zone.deleteMany()
    await prisma.city.deleteMany()
    
    console.log('✅ Database reset complete!')
    console.log('💡 Run "npm run db:seed" to populate with sample data')
  } catch (error) {
    console.error('❌ Error resetting database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

resetDatabase()

