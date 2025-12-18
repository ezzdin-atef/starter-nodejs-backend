import { Router, Request, Response } from 'express'
import { prisma } from '@/config/database'
import { logger } from '@/config/logger'

const router = Router()

// Health check - basic server status
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Readiness check - verifies database connectivity
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`
    
    res.json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok'
      }
    })
  } catch (error) {
    logger.error('Readiness check failed', { error })
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'error'
      },
      error: 'Database connection failed'
    })
  }
})

export { router as healthRoutes }

