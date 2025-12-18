import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { ResetPasswordUseCase } from './reset-password.usecase'
import { PasswordResetRepository } from '../domain/repositories/PasswordResetRepository'
import { PasswordRepository } from '../domain/repositories/PasswordRepository'
import { SessionRepository } from '../domain/repositories/SessionRepository'
import { PasswordService } from '../domain/services/PasswordService'
import { UnauthorizedError } from '../domain/errors/UnauthorizedError'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { PasswordResetToken } from '../domain/entities/PasswordResetToken'
import { Password } from '../domain/entities/Password'

describe('ResetPasswordUseCase', () => {
  let resetPasswordUseCase: ResetPasswordUseCase
  let mockPasswordResetRepo: jest.Mocked<PasswordResetRepository>
  let mockPasswordRepo: jest.Mocked<PasswordRepository>
  let mockSessionRepo: jest.Mocked<SessionRepository>
  let mockPasswordService: jest.Mocked<PasswordService>

  beforeEach(() => {
    mockPasswordResetRepo = {
      savePasswordResetToken: jest.fn(),
      findPasswordResetTokenByToken: jest.fn(),
      markPasswordResetTokenAsUsed: jest.fn(),
      deleteExpiredPasswordResetTokens: jest.fn(),
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

    resetPasswordUseCase = new ResetPasswordUseCase(
      mockPasswordResetRepo,
      mockPasswordRepo,
      mockSessionRepo,
      mockPasswordService
    )
  })

  describe('execute', () => {
    it('should successfully reset password', async () => {
      const resetToken = 'reset-token-123'
      const userId = 'user-1'
      const newPassword = 'new-password-123'
      const hashedPassword = 'hashed-new-password'
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
      const token = new PasswordResetToken('token-1', userId, resetToken, expiresAt)
      const password = new Password(userId, 'old-hash')

      mockPasswordResetRepo.findPasswordResetTokenByToken.mockResolvedValue(token)
      mockPasswordRepo.findPasswordByUserId.mockResolvedValue(password)
      mockPasswordService.hash.mockResolvedValue(hashedPassword)
      mockPasswordResetRepo.markPasswordResetTokenAsUsed.mockResolvedValue(undefined)
      mockPasswordRepo.updatePassword.mockResolvedValue(undefined)
      mockSessionRepo.deleteSessionsByUserId.mockResolvedValue(undefined)

      await resetPasswordUseCase.execute({
        resetToken,
        newPassword,
      })

      expect(mockPasswordResetRepo.findPasswordResetTokenByToken).toHaveBeenCalledWith(resetToken)
      expect(mockPasswordRepo.findPasswordByUserId).toHaveBeenCalledWith(userId)
      expect(mockPasswordService.hash).toHaveBeenCalledWith(newPassword)
      expect(mockPasswordResetRepo.markPasswordResetTokenAsUsed).toHaveBeenCalledWith('token-1')
      expect(mockPasswordRepo.updatePassword).toHaveBeenCalledWith(userId, hashedPassword)
      expect(mockSessionRepo.deleteSessionsByUserId).toHaveBeenCalledWith(userId)
    })

    it('should throw UnauthorizedError when reset token is not found', async () => {
      mockPasswordResetRepo.findPasswordResetTokenByToken.mockResolvedValue(null)

      await expect(
        resetPasswordUseCase.execute({
          resetToken: 'invalid-token',
          newPassword: 'new-password',
        })
      ).rejects.toThrow(UnauthorizedError)

      expect(mockPasswordRepo.findPasswordByUserId).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedError when reset token is invalid (used)', async () => {
      const resetToken = 'used-token'
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
      const token = new PasswordResetToken('token-1', 'user-1', resetToken, expiresAt, true)

      mockPasswordResetRepo.findPasswordResetTokenByToken.mockResolvedValue(token)

      await expect(
        resetPasswordUseCase.execute({
          resetToken,
          newPassword: 'new-password',
        })
      ).rejects.toThrow(UnauthorizedError)
    })

    it('should throw UnauthorizedError when reset token is expired', async () => {
      const resetToken = 'expired-token'
      const expiresAt = new Date(Date.now() - 1000)
      const token = new PasswordResetToken('token-1', 'user-1', resetToken, expiresAt)

      mockPasswordResetRepo.findPasswordResetTokenByToken.mockResolvedValue(token)

      await expect(
        resetPasswordUseCase.execute({
          resetToken,
          newPassword: 'new-password',
        })
      ).rejects.toThrow(UnauthorizedError)
    })

    it('should throw NotFoundError when user password is not found', async () => {
      const resetToken = 'valid-token'
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
      const token = new PasswordResetToken('token-1', 'user-1', resetToken, expiresAt)

      mockPasswordResetRepo.findPasswordResetTokenByToken.mockResolvedValue(token)
      mockPasswordRepo.findPasswordByUserId.mockResolvedValue(null)

      await expect(
        resetPasswordUseCase.execute({
          resetToken,
          newPassword: 'new-password',
        })
      ).rejects.toThrow(NotFoundError)
    })
  })
})

