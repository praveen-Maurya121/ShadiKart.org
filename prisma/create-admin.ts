import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin@shadikart.com'
  const password = process.argv[3] || 'admin123'
  const name = process.argv[4] || 'Admin User'
  const role = process.argv[5] || 'ADMIN'

  const passwordHash = await hash(password, 12)

  // Check if user exists
  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    // Update role
    const updated = await prisma.user.update({
      where: { email },
      data: { role },
    })
    console.log(`✅ Updated user ${email} to role: ${role}`)
  } else {
    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
      },
    })
    console.log(`✅ Created ${role} user: ${email}`)
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

