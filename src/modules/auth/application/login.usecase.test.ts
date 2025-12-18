import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { LoginUseCase } from './login.usecase'
import { UserRepository } from '@/modules/user/domain/repositories/UserRepository'
import { PasswordRepository } from '../domain/repositories/PasswordRepository'
import { SessionRepository } from '../domain/repositories/SessionRepository'
import { PasswordService } from '../domain/services/PasswordService'
import { JWTService } from '../infrastructure/jwt.service'
import { InvalidCredentialsError } from '../domain/errors/InvalidCredentialsError'
import { User } from '@/modules/user/domain/entities/User'
import { Password } from '../domain/entities/Password'

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase
  let mockUserRepo: jest.Mocked<UserRepository>
  let mockPasswordRepo: jest.Mocked<PasswordRepository>
  let mockSessionRepo: jest.Mocked<SessionRepository>
  let mockPasswordService: jest.Mocked<PasswordService>
  let mockJwtService: jest.Mocked<JWTService>

  beforeEach(() => {
    mockUserRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any

    mockPasswordRepo = {
      findPasswordByUserId: jest.fn(),
      savePassword: jest.fn(),
      updatePassword: jest.fn(),
      deletePassword: jest.fn(),
    } as any

    mockSessionRepo = {
      findSessionByToken: jest.fn(),
      findSessionById: jest.fn(),
      saveSession: jest.fn(),
      deleteSession: jest.fn(),
      deleteSessionsByUserId: jest.fn(),
    } as any

    mockPasswordService = {
      hash: jest.fn(),
      verify: jest.fn(),
    } as any

    mockJwtService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      getTokenExpiration: jest.fn(),
      verifyToken: jest.fn(),
      verifyAccessToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
    } as any

    loginUseCase = new LoginUseCase(
      mockUserRepo,
      mockPasswordRepo,
      mockSessionRepo,
      mockPasswordService,
      mockJwtService
    )
  })

  describe('execute', () => {
    it('should successfully login with valid credentials', async () => {
      const user = new User('user-1', 'test@example.com', 'Test User')
      const password = new Password('user-1', 'hashed-password')
      const accessToken = 'access-token'
      const refreshToken = 'refresh-token'
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      mockUserRepo.findByEmail.mockResolvedValue(user)
      mockPasswordRepo.findPasswordByUserId.mockResolvedValue(password)
      mockPasswordService.verify.mockResolvedValue(true)
      mockJwtService.generateAccessToken.mockReturnValue(accessToken)
      mockJwtService.generateRefreshToken.mockReturnValue(refreshToken)
      mockJwtService.getTokenExpiration.mockReturnValue(expiresAt)

      const result = await loginUseCase.execute({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result).toEqual({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      })
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com')
      expect(mockPasswordRepo.findPasswordByUserId).toHaveBeenCalledWith('user-1')
      expect(mockPasswordService.verify).toHaveBeenCalledWith('password123', 'hashed-password')
      expect(mockSessionRepo.saveSession).toHaveBeenCalled()
    })

    it('should throw InvalidCredentialsError when user is not found', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null)

      await expect(
        loginUseCase.execute({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(InvalidCredentialsError)

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('nonexistent@example.com')
      expect(mockPasswordRepo.findPasswordByUserId).not.toHaveBeenCalled()
    })

    it('should throw InvalidCredentialsError when password is not found', async () => {
      const user = new User('user-1', 'test@example.com', 'Test User')
      mockUserRepo.findByEmail.mockResolvedValue(user)
      mockPasswordRepo.findPasswordByUserId.mockResolvedValue(null)

      await expect(
        loginUseCase.execute({
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(InvalidCredentialsError)

      expect(mockPasswordService.verify).not.toHaveBeenCalled()
    })

    it('should throw InvalidCredentialsError when password is invalid', async () => {
      const user = new User('user-1', 'test@example.com', 'Test User')
      const password = new Password('user-1', 'hashed-password')
      mockUserRepo.findByEmail.mockResolvedValue(user)
      mockPasswordRepo.findPasswordByUserId.mockResolvedValue(password)
      mockPasswordService.verify.mockResolvedValue(false)

      await expect(
        loginUseCase.execute({
          email: 'test@example.com',
          password: 'wrong-password',
        })
      ).rejects.toThrow(InvalidCredentialsError)

      expect(mockPasswordService.verify).toHaveBeenCalledWith('wrong-password', 'hashed-password')
      expect(mockJwtService.generateAccessToken).not.toHaveBeenCalled()
    })
  })
})

