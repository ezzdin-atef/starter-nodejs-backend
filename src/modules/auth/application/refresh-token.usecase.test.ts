import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { RefreshTokenUseCase } from './refresh-token.usecase'
import { SessionRepository } from '../domain/repositories/SessionRepository'
import { JWTService } from '../infrastructure/jwt.service'
import { UnauthorizedError } from '../domain/errors/UnauthorizedError'
import { Session } from '../domain/entities/Session'

describe('RefreshTokenUseCase', () => {
  let refreshTokenUseCase: RefreshTokenUseCase
  let mockSessionRepo: jest.Mocked<SessionRepository>
  let mockJwtService: jest.Mocked<JWTService>

  beforeEach(() => {
    mockSessionRepo = {
      findSessionByToken: jest.fn(),
      findSessionById: jest.fn(),
      saveSession: jest.fn(),
      deleteSession: jest.fn(),
      deleteSessionsByUserId: jest.fn(),
    } as any

    mockJwtService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      getTokenExpiration: jest.fn(),
      verifyToken: jest.fn(),
      verifyAccessToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
    } as any

    refreshTokenUseCase = new RefreshTokenUseCase(mockSessionRepo, mockJwtService)
  })

  describe('execute', () => {
    it('should successfully refresh tokens', async () => {
      const oldRefreshToken = 'old-refresh-token'
      const newAccessToken = 'new-access-token'
      const newRefreshToken = 'new-refresh-token'
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      const session = new Session('session-1', 'user-1', oldRefreshToken, expiresAt)
      const payload = { userId: 'user-1', email: 'test@example.com', type: 'refresh' as const }

      mockJwtService.verifyRefreshToken.mockReturnValue(payload)
      mockSessionRepo.findSessionByToken.mockResolvedValue(session)
      mockJwtService.generateAccessToken.mockReturnValue(newAccessToken)
      mockJwtService.generateRefreshToken.mockReturnValue(newRefreshToken)
      mockJwtService.getTokenExpiration.mockReturnValue(expiresAt)

      const result = await refreshTokenUseCase.execute(oldRefreshToken)

      expect(result).toEqual({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      })
      expect(mockJwtService.verifyRefreshToken).toHaveBeenCalledWith(oldRefreshToken)
      expect(mockSessionRepo.findSessionByToken).toHaveBeenCalledWith(oldRefreshToken)
      expect(mockSessionRepo.deleteSession).toHaveBeenCalledWith('session-1')
      expect(mockSessionRepo.saveSession).toHaveBeenCalled()
    })

    it('should throw UnauthorizedError when token is invalid', async () => {
      const invalidToken = 'invalid-token'
      mockJwtService.verifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      await expect(refreshTokenUseCase.execute(invalidToken)).rejects.toThrow(UnauthorizedError)

      expect(mockJwtService.verifyRefreshToken).toHaveBeenCalledWith(invalidToken)
      expect(mockSessionRepo.findSessionByToken).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedError when session is not found', async () => {
      const refreshToken = 'valid-token'
      const payload = { userId: 'user-1', email: 'test@example.com', type: 'refresh' as const }

      mockJwtService.verifyRefreshToken.mockReturnValue(payload)
      mockSessionRepo.findSessionByToken.mockResolvedValue(null)

      await expect(refreshTokenUseCase.execute(refreshToken)).rejects.toThrow(UnauthorizedError)

      expect(mockSessionRepo.findSessionByToken).toHaveBeenCalledWith(refreshToken)
      expect(mockSessionRepo.deleteSession).not.toHaveBeenCalled()
    })

    it('should throw UnauthorizedError when session is expired', async () => {
      const refreshToken = 'valid-token'
      const expiredDate = new Date(Date.now() - 1000)
      const session = new Session('session-1', 'user-1', refreshToken, expiredDate)
      const payload = { userId: 'user-1', email: 'test@example.com', type: 'refresh' as const }

      mockJwtService.verifyRefreshToken.mockReturnValue(payload)
      mockSessionRepo.findSessionByToken.mockResolvedValue(session)

      await expect(refreshTokenUseCase.execute(refreshToken)).rejects.toThrow(UnauthorizedError)

      expect(mockSessionRepo.deleteSession).toHaveBeenCalledWith('session-1')
      expect(mockJwtService.generateAccessToken).not.toHaveBeenCalled()
    })
  })
})

