import { Router } from 'express'
import { AuthController } from './auth.controller'
import { authRateLimiter, passwordResetRateLimiter } from '@/shared/middleware/rate-limit.middleware'
import { PrismaUserRepository } from '@/modules/user/persistence/prisma-user.repository'
import { PrismaPasswordRepository } from '@/modules/auth/persistence/prisma-password.repository'
import { PrismaSessionRepository } from '@/modules/auth/persistence/prisma-session.repository'
import { PrismaAccountRepository } from '@/modules/auth/persistence/prisma-account.repository'
import { PrismaPasswordResetRepository } from '@/modules/auth/persistence/prisma-password-reset.repository'
import { BcryptPasswordService } from '@/modules/auth/persistence/bcrypt-password.service'
import { NodemailerEmailService } from '@/modules/auth/infrastructure/nodemailer-email.service'
import { JWTService } from '@/modules/auth/infrastructure/jwt.service'

const router = Router()
const controller = new AuthController(
  new PrismaUserRepository(),
  new PrismaPasswordRepository(),
  new PrismaSessionRepository(),
  new PrismaAccountRepository(),
  new PrismaPasswordResetRepository(),
  new BcryptPasswordService(),
  new NodemailerEmailService(),
  new JWTService()
)

// Email/Password authentication (with strict rate limiting)
router.post('/register', authRateLimiter, controller.register.bind(controller))
router.post('/login', authRateLimiter, controller.login.bind(controller))
router.post('/refresh', controller.refresh.bind(controller))
router.post('/logout', controller.logout.bind(controller))

// Password reset (with dedicated rate limiting)
router.post('/password/reset-request', passwordResetRateLimiter, controller.requestPasswordReset.bind(controller))
router.post('/password/reset', passwordResetRateLimiter, controller.resetPassword.bind(controller))

// OAuth
router.get('/google', controller.googleOAuth.bind(controller))
router.get('/google/callback', controller.googleCallback.bind(controller))
router.get('/github', controller.githubOAuth.bind(controller))
router.get('/github/callback', controller.githubCallback.bind(controller))

export { router as authRoutes }

