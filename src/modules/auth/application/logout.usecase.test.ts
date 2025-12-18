import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { LogoutUseCase } from './logout.usecase'
import { SessionRepository } from '../domain/repositories/SessionRepository'
import { UnauthorizedError } from '../domain/errors/UnauthorizedError'
import { Session } from '../domain/entities/Session'

describe('LogoutUseCase', () => {
  let logoutUseCase: LogoutUseCase
  let mockSessionRepo: jest.Mocked<SessionRepository>

  beforeEach(() => {
    mockSessionRepo = {
      findSessionByToken: jest.fn(),
      findSessionById: jest.fn(),
      saveSession: jest.fn(),
      deleteSession: jest.fn(),
      deleteSessionsByUserId: jest.fn(),
    } as any

    logoutUseCase = new LogoutUseCase(mockSessionRepo)
  })

  describe('execute', () => {
    it('should successfully logout when session exists', async () => {
      const refreshToken = 'refresh-token-123'
      const session = new Session('session-1', 'user-1', refreshToken, new Date())

      mockSessionRepo.findSessionByToken.mockResolvedValue(session)

      await logoutUseCase.execute(refreshToken)

      expect(mockSessionRepo.findSessionByToken).toHaveBeenCalledWith(refreshToken)
      expect(mockSessionRepo.deleteSession).toHaveBeenCalledWith('session-1')
    })

    it('should throw UnauthorizedError when session is not found', async () => {
      const refreshToken = 'invalid-token'
      mockSessionRepo.findSessionByToken.mockResolvedValue(null)

      await expect(logoutUseCase.execute(refreshToken)).rejects.toThrow(UnauthorizedError)

      expect(mockSessionRepo.findSessionByToken).toHaveBeenCalledWith(refreshToken)
      expect(mockSessionRepo.deleteSession).not.toHaveBeenCalled()
    })
  })
})

