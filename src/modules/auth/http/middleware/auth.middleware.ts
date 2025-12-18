import { Request, Response, NextFunction } from 'express'
import { JWTService } from '../../infrastructure/jwt.service'
import { UnauthorizedError } from '../../domain/errors/UnauthorizedError'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      userEmail?: string
    }
  }
}

export function authMiddleware(jwtService: JWTService) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Missing or invalid authorization header')
      }

      const token = authHeader.substring(7) // Remove 'Bearer ' prefix
      const payload = jwtService.verifyAccessToken(token)

      req.userId = payload.userId
      req.userEmail = payload.email

      next()
    } catch (error) {
      if (error instanceof Error) {
        next(new UnauthorizedError(error.message))
      } else {
        next(new UnauthorizedError())
      }
    }
  }
}

export function optionalAuthMiddleware(jwtService: JWTService) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const payload = jwtService.verifyAccessToken(token)
        req.userId = payload.userId
        req.userEmail = payload.email
      }
      next()
    } catch (error) {
      // Ignore errors for optional auth
      next()
    }
  }
}

