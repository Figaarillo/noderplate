import { PrismaClient } from '@prisma/client'
import { env } from '../config/env'

export async function checkDatabaseHealth(): Promise<void> {
  if (env.orm !== 'prisma') {
    // eslint-disable-next-line no-console
    console.log('[Healthcheck] Skipping Prisma healthcheck (using MikroORM)')
    return
  }

  // eslint-disable-next-line no-console
  console.log('[Healthcheck] Checking database connection...')

  const prisma = new PrismaClient()

  try {
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    // eslint-disable-next-line no-console
    console.log('[Healthcheck] Database connection successful')
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Healthcheck] Database connection failed:', error)
    throw new Error('Database healthcheck failed')
  } finally {
    await prisma.$disconnect()
  }
}
