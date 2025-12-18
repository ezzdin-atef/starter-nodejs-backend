import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { DeleteUserUseCase } from './delete-user.usecase'
import { UserRepository } from '../domain/repositories/UserRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { User } from '../domain/entities/User'

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase
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

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepo)
  })

  describe('execute', () => {
    it('should successfully delete user', async () => {
      const user = new User('user-1', 'test@example.com', 'Test User')
      mockUserRepo.findById.mockResolvedValue(user)
      mockUserRepo.delete.mockResolvedValue(undefined)

      await deleteUserUseCase.execute('user-1')

      expect(mockUserRepo.findById).toHaveBeenCalledWith('user-1')
      expect(mockUserRepo.delete).toHaveBeenCalledWith('user-1')
    })

    it('should throw NotFoundError when user is not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null)

      await expect(deleteUserUseCase.execute('nonexistent-id')).rejects.toThrow(NotFoundError)

      expect(mockUserRepo.findById).toHaveBeenCalledWith('nonexistent-id')
      expect(mockUserRepo.delete).not.toHaveBeenCalled()
    })
  })
})

