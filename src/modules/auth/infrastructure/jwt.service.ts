import jwt, { SignOptions } from 'jsonwebtoken'
import { env } from '@/config/env'

export interface JWTPayload {
  userId: string
  email: string
  type: 'access' | 'refresh'
}

export class JWTService {
  private readonly secret: string
  private readonly accessExpiresIn: string
  private readonly refreshExpiresIn: string

  constructor() {
    this.secret = env.JWT_SECRET
    this.accessExpiresIn = env.JWT_ACCESS_EXPIRES_IN
    this.refreshExpiresIn = env.JWT_REFRESH_EXPIRES_IN
  }

  generateAccessToken(payload: Omit<JWTPayload, 'type'>): string {
    const tokenPayload = { ...payload, type: 'access' as const }
    return jwt.sign(tokenPayload, this.secret, {
      expiresIn: this.accessExpiresIn
    } as SignOptions)
  }

  generateRefreshToken(payload: Omit<JWTPayload, 'type'>): string {
    const tokenPayload = { ...payload, type: 'refresh' as const }
    return jwt.sign(tokenPayload, this.secret, {
      expiresIn: this.refreshExpiresIn
    } as SignOptions)
  }

  verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as JWTPayload
      return decoded
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired')
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token')
      }
      throw error
    }
  }

  verifyAccessToken(token: string): JWTPayload {
    const payload = this.verifyToken(token)
    if (payload.type !== 'access') {
      throw new Error('Invalid token type')
    }
    return payload
  }

  verifyRefreshToken(token: string): JWTPayload {
    const payload = this.verifyToken(token)
    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type')
    }
    return payload
  }

  getTokenExpiration(token: string): Date {
    const decoded = jwt.decode(token) as jwt.JwtPayload | null
    if (!decoded || !decoded.exp) {
      throw new Error('Invalid token format')
    }
    return new Date(decoded.exp * 1000)
  }
}

