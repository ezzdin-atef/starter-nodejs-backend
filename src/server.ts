import 'dotenv/config'
import { app } from './app'
import { env } from './config/env'
import { prisma } from './config/database'
import { logger } from './config/logger'

const PORT = Number(env.PORT)

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, {
    port: PORT,
    environment: env.NODE_ENV
  })
})

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received, starting graceful shutdown...`)

  // Stop accepting new requests
  server.close(() => {
    logger.info('HTTP server closed')
  })

  // Close database connections
  try {
    await prisma.$disconnect()
    logger.info('Database connections closed')
  } catch (error) {
    logger.error('Error closing database connections', { error })
  }

  // Force exit after timeout
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000) // 10 second timeout
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error })
  gracefulShutdown('uncaughtException')
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason, promise })
  gracefulShutdown('unhandledRejection')
})