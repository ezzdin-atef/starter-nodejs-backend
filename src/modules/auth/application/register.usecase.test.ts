import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { RegisterUseCase } from './register.usecase'
import { UserRepository } from '@/modules/user/domain/repositories/UserRepository'
import { PasswordService } from '../domain/services/PasswordService'
import { ConflictError } from '@/shared/errors/ConflictError'
import { User } from '@/modules/user/domain/entities/User'

// Mock Prisma
jest.mock('@/config/database', () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}))

import { prisma } from '@/config/database'

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase
  let mockUserRepo: jest.Mocked<UserRepository>
  let mockPasswordService: jest.Mocked<PasswordService>

  beforeEach(() => {
    mockUserRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any

    mockPasswordService = {
      hash: jest.fn(),
      verify: jest.fn(),
    } as any

    registerUseCase = new RegisterUseCase(mockUserRepo, mockPasswordService)
    jest.clearAllMocks()
  })

  describe('execute', () => {
    it('should successfully register a new user', async () => {
      const hashedPassword = 'hashed-password-123'
      const userId = 'user-123'
      const email = 'newuser@example.com'

      mockUserRepo.findByEmail.mockResolvedValue(null)
      mockPasswordService.hash.mockResolvedValue(hashedPassword)
      const mockTransaction = prisma.$transaction as jest.Mock
      mockTransaction.mockImplementation(async (callback: unknown) => {
        const tx = {
          user: {
            create: jest.fn(),
          },
          password: {
            create: jest.fn(),
          },
        }
        return await (callback as (tx: any) => Promise<any>)(tx)
      })

      const result = await registerUseCase.execute({
        email,
        password: 'password123',
        name: 'New User',
      })

      expect(result).toEqual({
        userId: expect.any(String),
        email,
      })
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(email)
      expect(mockPasswordService.hash).toHaveBeenCalledWith('password123')
      expect(prisma.$transaction).toHaveBeenCalled()
    })

    it('should throw ConflictError when email already exists', async () => {
      const existingUser = new User('user-1', 'existing@example.com', 'Existing User')
      mockUserRepo.findByEmail.mockResolvedValue(existingUser)

      await expect(
        registerUseCase.execute({
          email: 'existing@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(ConflictError)

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('existing@example.com')
      expect(mockPasswordService.hash).not.toHaveBeenCalled()
      expect(prisma.$transaction).not.toHaveBeenCalled()
    })
  })
})

