import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { GetUserByIdUseCase } from './get-user-by-id.usecase'
import { UserRepository } from '../domain/repositories/UserRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { User } from '../domain/entities/User'

describe('GetUserByIdUseCase', () => {
  let getUserByIdUseCase: GetUserByIdUseCase
  let mockUserRepo: jest.Mocked<UserRepository>

  beforeEach(() => {
    mockUserRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any

    getUserByIdUseCase = new GetUserByIdUseCase(mockUserRepo)
  })

  describe('execute', () => {
    it('should successfully retrieve user by id', async () => {
      const user = new User('user-1', 'test@example.com', 'Test User')
      mockUserRepo.findById.mockResolvedValue(user)

      const result = await getUserByIdUseCase.execute('user-1')

      expect(result).toEqual(user)
      expect(mockUserRepo.findById).toHaveBeenCalledWith('user-1')
    })

    it('should throw NotFoundError when user is not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null)

      await expect(getUserByIdUseCase.execute('nonexistent-id')).rejects.toThrow(NotFoundError)

      expect(mockUserRepo.findById).toHaveBeenCalledWith('nonexistent-id')
    })
  })
})

