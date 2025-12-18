import { authMiddleware, optionalAuthMiddleware } from './auth.middleware'
import { JWTService } from '@/modules/auth/infrastructure/jwt.service'

// Export middleware instances
const jwtService = new JWTService()
export const requireAuth = authMiddleware(jwtService)
export const optionalAuth = optionalAuthMiddleware(jwtService)

