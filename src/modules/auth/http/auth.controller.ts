import { Request, Response, NextFunction } from 'express'
import { RegisterUseCase } from '../application/register.usecase'
import { LoginUseCase } from '../application/login.usecase'
import { RefreshTokenUseCase } from '../application/refresh-token.usecase'
import { LogoutUseCase } from '../application/logout.usecase'
import { RequestPasswordResetUseCase } from '../application/request-password-reset.usecase'
import { ResetPasswordUseCase } from '../application/reset-password.usecase'
import { OAuthCallbackUseCase } from '../application/oauth-callback.usecase'
import { UserRepository } from '@/modules/user/domain/repositories/UserRepository'
import { PasswordRepository } from '../domain/repositories/PasswordRepository'
import { SessionRepository } from '../domain/repositories/SessionRepository'
import { AccountRepository } from '../domain/repositories/AccountRepository'
import { PasswordResetRepository } from '../domain/repositories/PasswordResetRepository'
import { PasswordService } from '../domain/services/PasswordService'
import { EmailService } from '../domain/services/EmailService'
import { JWTService } from '../infrastructure/jwt.service'
import { validateRegisterDto } from './dto/register.dto'
import { validateLoginDto } from './dto/login.dto'
import { validateRefreshTokenDto } from './dto/refresh-token.dto'
import {
  validateRequestPasswordResetDto,
  validateResetPasswordDto
} from './dto/reset-password.dto'
import { toAuthResponseDto } from './dto/auth-response.dto'
import { getGoogleOAuthConfig, getGitHubOAuthConfig } from '../infrastructure/oauth.config'
import { AuthProvider } from '../domain/entities/Account'

export class AuthController {
  constructor(
    private userRepo: UserRepository,
    private passwordRepo: PasswordRepository,
    private sessionRepo: SessionRepository,
    private accountRepo: AccountRepository,
    private passwordResetRepo: PasswordResetRepository,
    private passwordService: PasswordService,
    private emailService: EmailService,
    private jwtService: JWTService
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = validateRegisterDto(req.body)
      const useCase = new RegisterUseCase(
        this.userRepo,
        this.passwordService
      )
      const result = await useCase.execute(dto)

      // After registration, automatically log in
      const loginUseCase = new LoginUseCase(
        this.userRepo,
        this.passwordRepo,
        this.sessionRepo,
        this.passwordService,
        this.jwtService
      )
      const loginResult = await loginUseCase.execute({
        email: dto.email,
        password: dto.password
      })

      res.status(201).json(toAuthResponseDto(loginResult))
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = validateLoginDto(req.body)
      const useCase = new LoginUseCase(
        this.userRepo,
        this.passwordRepo,
        this.sessionRepo,
        this.passwordService,
        this.jwtService
      )
      const result = await useCase.execute(dto)
      res.json(toAuthResponseDto(result))
    } catch (error) {
      next(error)
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = validateRefreshTokenDto(req.body)
      const useCase = new RefreshTokenUseCase(this.sessionRepo, this.jwtService)
      const result = await useCase.execute(dto.refreshToken)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = validateRefreshTokenDto(req.body)
      const useCase = new LogoutUseCase(this.sessionRepo)
      await useCase.execute(dto.refreshToken)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }

  async requestPasswordReset(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = validateRequestPasswordResetDto(req.body)
      const useCase = new RequestPasswordResetUseCase(
        this.userRepo,
        this.passwordResetRepo,
        this.emailService
      )
      await useCase.execute(dto.email)
      // Always return success to prevent email enumeration
      res.json({ message: 'If the email exists, a password reset link has been sent' })
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = validateResetPasswordDto(req.body)
      const useCase = new ResetPasswordUseCase(
        this.passwordResetRepo,
        this.passwordRepo,
        this.sessionRepo,
        this.passwordService
      )
      await useCase.execute(dto)
      res.json({ message: 'Password has been reset successfully' })
    } catch (error) {
      next(error)
    }
  }

  async googleOAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const config = getGoogleOAuthConfig()
      if (!config) {
        return res.status(503).json({
          error: { message: 'Google OAuth is not configured', statusCode: 503 }
        })
      }

      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent'
      })

      res.redirect(`${config.authorizationUrl}?${params.toString()}`)
    } catch (error) {
      next(error)
    }
  }

  async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const config = getGoogleOAuthConfig()
      if (!config) {
        return res.status(503).json({
          error: { message: 'Google OAuth is not configured', statusCode: 503 }
        })
      }

      const { code } = req.query
      if (!code || typeof code !== 'string') {
        return res.status(400).json({
          error: { message: 'Missing authorization code', statusCode: 400 }
        })
      }

      const useCase = new OAuthCallbackUseCase(
        this.userRepo,
        this.accountRepo,
        this.sessionRepo,
        this.jwtService
      )
      const result = await useCase.execute({
        provider: AuthProvider.GOOGLE,
        code,
        config
      })

      // In a real app, you might redirect to frontend with tokens
      // For now, return JSON response
      res.json(toAuthResponseDto(result))
    } catch (error) {
      next(error)
    }
  }

  async githubOAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const config = getGitHubOAuthConfig()
      if (!config) {
        return res.status(503).json({
          error: { message: 'GitHub OAuth is not configured', statusCode: 503 }
        })
      }

      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        scope: 'user:email'
      })

      res.redirect(`${config.authorizationUrl}?${params.toString()}`)
    } catch (error) {
      next(error)
    }
  }

  async githubCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const config = getGitHubOAuthConfig()
      if (!config) {
        return res.status(503).json({
          error: { message: 'GitHub OAuth is not configured', statusCode: 503 }
        })
      }

      const { code } = req.query
      if (!code || typeof code !== 'string') {
        return res.status(400).json({
          error: { message: 'Missing authorization code', statusCode: 400 }
        })
      }

      const useCase = new OAuthCallbackUseCase(
        this.userRepo,
        this.accountRepo,
        this.sessionRepo,
        this.jwtService
      )
      const result = await useCase.execute({
        provider: AuthProvider.GITHUB,
        code,
        config
      })

      // In a real app, you might redirect to frontend with tokens
      // For now, return JSON response
      res.json(toAuthResponseDto(result))
    } catch (error) {
      next(error)
    }
  }
}

