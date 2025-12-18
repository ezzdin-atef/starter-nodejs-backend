import { SessionRepository } from '../domain/repositories/SessionRepository'
import { Session } from '../domain/entities/Session'
import { JWTService } from '../infrastructure/jwt.service'
import { UnauthorizedError } from '../domain/errors/UnauthorizedError'
import { randomUUID } from 'crypto'

export interface RefreshTokenResult {
  accessToken: string
  refreshToken: string
}

export class RefreshTokenUseCase {
  constructor(
    private sessionRepo: SessionRepository,
    private jwtService: JWTService
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenResult> {
    // Verify refresh token
    let payload
    try {
      payload = this.jwtService.verifyRefreshToken(refreshToken)
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token')
    }

    // Find session
    const session = await this.sessionRepo.findSessionByToken(refreshToken)
    if (!session) {
      throw new UnauthorizedError('Session not found')
    }

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      await this.sessionRepo.deleteSession(session.id)
      throw new UnauthorizedError('Session expired')
    }

    // Generate new tokens
    const newAccessToken = this.jwtService.generateAccessToken({
      userId: payload.userId,
      email: payload.email
    })
    const newRefreshToken = this.jwtService.generateRefreshToken({
      userId: payload.userId,
      email: payload.email
    })

    // Delete old session and create new one
    await this.sessionRepo.deleteSession(session.id)

    const expiresAt = this.jwtService.getTokenExpiration(newRefreshToken)

    const newSession = new Session(
      randomUUID(),
      payload.userId,
      newRefreshToken,
      expiresAt
    )
    await this.sessionRepo.saveSession(newSession)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }
}

