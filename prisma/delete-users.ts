import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteAllUsers() {
  try {
    // Delete all related data first (due to foreign key constraints)
    await prisma.rating.deleteMany()
    await prisma.chatMessage.deleteMany()
    await prisma.mediaAsset.deleteMany()
    await prisma.liveStream.deleteMany()
    await prisma.guest.deleteMany()
    await prisma.bookingAddOn.deleteMany()
    await prisma.zoneAssignment.deleteMany()
    await prisma.booking.deleteMany()
    
    // Now delete all users
    const result = await prisma.user.deleteMany()
    console.log(`✅ Deleted ${result.count} user(s)`)
  } catch (error) {
    console.error('Error deleting users:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

deleteAllUsers()

