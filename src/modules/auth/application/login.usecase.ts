import { UserRepository } from '@/modules/user/domain/repositories/UserRepository'
import { PasswordRepository } from '../domain/repositories/PasswordRepository'
import { SessionRepository } from '../domain/repositories/SessionRepository'
import { PasswordService } from '../domain/services/PasswordService'
import { Session } from '../domain/entities/Session'
import { JWTService } from '../infrastructure/jwt.service'
import { InvalidCredentialsError } from '../domain/errors/InvalidCredentialsError'
import { randomUUID } from 'crypto'

export interface LoginResult {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name?: string
  }
}

export class LoginUseCase {
  constructor(
    private userRepo: UserRepository,
    private passwordRepo: PasswordRepository,
    private sessionRepo: SessionRepository,
    private passwordService: PasswordService,
    private jwtService: JWTService
  ) {}

  async execute(data: {
    email: string
    password: string
  }): Promise<LoginResult> {
    // Find user
    const user = await this.userRepo.findByEmail(data.email)
    if (!user) {
      throw new InvalidCredentialsError()
    }

    // Verify password
    const password = await this.passwordRepo.findPasswordByUserId(user.id)
    if (!password) {
      throw new InvalidCredentialsError()
    }

    const isValid = await this.passwordService.verify(data.password, password.hash)
    if (!isValid) {
      throw new InvalidCredentialsError()
    }

    // Generate tokens
    const accessToken = this.jwtService.generateAccessToken({
      userId: user.id,
      email: user.email
    })
    const refreshToken = this.jwtService.generateRefreshToken({
      userId: user.id,
      email: user.email
    })

    // Get expiration from refresh token
    const expiresAt = this.jwtService.getTokenExpiration(refreshToken)

    // Save session
    const session = new Session(randomUUID(), user.id, refreshToken, expiresAt)
    await this.sessionRepo.saveSession(session)

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  }
}

