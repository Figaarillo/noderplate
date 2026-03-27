import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await argon2.hash('admin123')
  const userPassword = await argon2.hash('user123')

  const admin = await prisma.user.upsert({
    where: { email: 'admin@noderplate.local' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@noderplate.local',
      password: adminPassword,
      phoneNumber: '1234567890',
      city: 'AdminCity',
      province: 'AdminProvince',
      country: 'AdminCountry',
      role: 'admin'
    }
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@noderplate.local' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@noderplate.local',
      password: userPassword,
      phoneNumber: '0987654321',
      city: 'UserCity',
      province: 'UserProvince',
      country: 'UserCountry',
      role: 'user'
    }
  })

  // eslint-disable-next-line no-console
  console.log('Seeding completed:')
  // eslint-disable-next-line no-console
  console.log(`- Admin: ${admin.email} (password: admin123)`)
  // eslint-disable-next-line no-console
  console.log(`- User: ${user.email} (password: user123)`)
}

main()
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
