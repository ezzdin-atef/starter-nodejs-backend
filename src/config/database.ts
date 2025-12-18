import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { env } from './env'
import { logger } from './logger'

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL
})

// Create the Prisma adapter
const adapter = new PrismaPg(pool)

// Prisma connection pooling configuration for production
const prismaClientOptions: ConstructorParameters<typeof PrismaClient>[0] = {
  adapter,
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty'
}

// Configure connection pooling via DATABASE_URL query parameters
// The DATABASE_URL should include: ?connection_limit=10&pool_timeout=20
// For production, consider using a connection pooler like PgBouncer

export const prisma = new PrismaClient(prismaClientOptions)

// Handle Prisma connection errors gracefully
prisma.$on('error' as never, (e: Error) => {
  logger.error('Prisma Client Error', { error: e })
})

