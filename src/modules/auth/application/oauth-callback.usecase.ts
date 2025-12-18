import { UserRepository } from '@/modules/user/domain/repositories/UserRepository'
import { User } from '@/modules/user/domain/entities/User'
import { AccountRepository } from '../domain/repositories/AccountRepository'
import { SessionRepository } from '../domain/repositories/SessionRepository'
import { Account, AuthProvider } from '../domain/entities/Account'
import { Session } from '../domain/entities/Session'
import { JWTService } from '../infrastructure/jwt.service'
import { OAuthProviderConfig } from '../infrastructure/oauth.config'
import { randomUUID } from 'crypto'
import { prisma } from '@/config/database'

export interface OAuthUserInfo {
  id: string
  email: string
  name?: string
  avatarUrl?: string
}

export interface OAuthCallbackResult {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name?: string
  }
}

export class OAuthCallbackUseCase {
  constructor(
    private userRepo: UserRepository,
    private accountRepo: AccountRepository,
    private sessionRepo: SessionRepository,
    private jwtService: JWTService
  ) {}

  async execute(data: {
    provider: AuthProvider
    code: string
    config: OAuthProviderConfig
  }): Promise<OAuthCallbackResult> {
    // Exchange code for access token
    const accessToken = await this.exchangeCodeForToken(data.code, data.config)

    // Get user info from provider
    const userInfo = await this.getUserInfo(accessToken, data.config)

    // Use transaction to ensure atomicity
    return await prisma.$transaction(async (tx) => {
      // Find or create account
      const accountRecord = await tx.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: data.provider,
            providerAccountId: userInfo.id
          }
        }
      })

      let userRecord
      if (accountRecord) {
        // User exists, get user data
        userRecord = await tx.user.findUnique({
          where: { id: accountRecord.userId }
        })
        if (!userRecord) {
          throw new Error('User not found for existing account')
        }

        // Update account tokens
        await tx.account.delete({ where: { id: accountRecord.id } })
        await tx.account.create({
          data: {
            id: randomUUID(),
            userId: accountRecord.userId,
            provider: data.provider,
            providerAccountId: userInfo.id,
            accessToken
          }
        })
      } else {
        // Check if user exists by email
        userRecord = await tx.user.findUnique({
          where: { email: userInfo.email }
        })

        if (!userRecord) {
          // Create new user
          const userId = randomUUID()
          userRecord = await tx.user.create({
            data: {
              id: userId,
              email: userInfo.email,
              name: userInfo.name,
              avatarUrl: userInfo.avatarUrl
            }
          })
        }

        // Create account
        await tx.account.create({
          data: {
            id: randomUUID(),
            userId: userRecord.id,
            provider: data.provider,
            providerAccountId: userInfo.id,
            accessToken
          }
        })
      }

      const user = new User(
        userRecord.id,
        userRecord.email || '',
        userRecord.name || undefined,
        userRecord.avatarUrl || undefined,
        userRecord.emailVerified || undefined,
        userRecord.createdAt,
        userRecord.updatedAt
      )

      // Generate JWT tokens
      const jwtAccessToken = this.jwtService.generateAccessToken({
        userId: user.id,
        email: user.email
      })
      const jwtRefreshToken = this.jwtService.generateRefreshToken({
        userId: user.id,
        email: user.email
      })

      // Save session
      const expiresAt = this.jwtService.getTokenExpiration(jwtRefreshToken)
      await tx.session.create({
        data: {
          id: randomUUID(),
          userId: user.id,
          token: jwtRefreshToken,
          expiresAt
        }
      })

      return {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    })
  }

  private async exchangeCodeForToken(
    code: string,
    config: OAuthProviderConfig
  ): Promise<string> {
    const params = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: config.redirectUri
    })

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: params.toString()
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const data = await response.json()
    return data.access_token || data.accessToken
  }

  private async getUserInfo(
    accessToken: string,
    config: OAuthProviderConfig
  ): Promise<OAuthUserInfo> {
    const response = await fetch(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to get user info')
    }

    const data = await response.json()

    // Handle different provider response formats
    if (config.userInfoUrl.includes('github.com')) {
      return {
        id: data.id.toString(),
        email: data.email || `${data.login}@users.noreply.github.com`,
        name: data.name || data.login,
        avatarUrl: data.avatar_url
      }
    } else {
      // Google format
      return {
        id: data.id || data.sub,
        email: data.email,
        name: data.name,
        avatarUrl: data.picture
      }
    }
  }
}

