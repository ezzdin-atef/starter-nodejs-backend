import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { RequestPasswordResetUseCase } from './request-password-reset.usecase'
import { UserRepository } from '@/modules/user/domain/repositories/UserRepository'
import { PasswordResetRepository } from '../domain/repositories/PasswordResetRepository'
import { EmailService } from '../domain/services/EmailService'
import { User } from '@/modules/user/domain/entities/User'

// Mock environment variables
jest.mock('@/config/env', () => ({
  env: {
    FRONTEND_URL: 'http://localhost:3000',
    PRODUCTION_URL: 'https://example.com',
  },
}))

describe('RequestPasswordResetUseCase', () => {
  let requestPasswordResetUseCase: RequestPasswordResetUseCase
  let mockUserRepo: jest.Mocked<UserRepository>
  let mockPasswordResetRepo: jest.Mocked<PasswordResetRepository>
  let mockEmailService: jest.Mocked<EmailService>

  beforeEach(() => {
    mockUserRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any

    mockPasswordResetRepo = {
      savePasswordResetToken: jest.fn(),
      findPasswordResetTokenByToken: jest.fn(),
      markPasswordResetTokenAsUsed: jest.fn(),
      deleteExpiredPasswordResetTokens: jest.fn(),
    } as any

    mockEmailService = {
      sendEmail: jest.fn(),
    } as any

    requestPasswordResetUseCase = new RequestPasswordResetUseCase(
      mockUserRepo,
      mockPasswordResetRepo,
      mockEmailService
    )
  })

  describe('execute', () => {
    it('should successfully request password reset when user exists', async () => {
      const user = new User('user-1', 'test@example.com', 'Test User')
      mockUserRepo.findByEmail.mockResolvedValue(user)
      mockPasswordResetRepo.savePasswordResetToken.mockResolvedValue(undefined)
      mockEmailService.sendEmail.mockResolvedValue(undefined)

      await requestPasswordResetUseCase.execute('test@example.com')

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com')
      expect(mockPasswordResetRepo.savePasswordResetToken).toHaveBeenCalled()
      expect(mockEmailService.sendEmail).toHaveBeenCalled()
    })

    it('should return silently when user does not exist (security)', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null)

      await requestPasswordResetUseCase.execute('nonexistent@example.com')

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('nonexistent@example.com')
      expect(mockPasswordResetRepo.savePasswordResetToken).not.toHaveBeenCalled()
      expect(mockEmailService.sendEmail).not.toHaveBeenCalled()
    })
  })
})

