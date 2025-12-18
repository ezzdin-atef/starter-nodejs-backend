import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { UpdateUserUseCase } from './update-user.usecase'
import { UserRepository } from '../domain/repositories/UserRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { ConflictError } from '@/shared/errors/ConflictError'
import { User } from '../domain/entities/User'

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase
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

    updateUserUseCase = new UpdateUserUseCase(mockUserRepo)
  })

  describe('execute', () => {
    it('should successfully update user', async () => {
      const existingUser = new User('user-1', 'test@example.com', 'Test User')
      const updatedUser = new User('user-1', 'test@example.com', 'Updated Name')

      mockUserRepo.findById.mockResolvedValue(existingUser)
      mockUserRepo.update.mockResolvedValue(updatedUser)

      const result = await updateUserUseCase.execute('user-1', {
        name: 'Updated Name',
      })

      expect(result).toEqual(updatedUser)
      expect(mockUserRepo.findById).toHaveBeenCalledWith('user-1')
      expect(mockUserRepo.update).toHaveBeenCalledWith('user-1', { name: 'Updated Name' })
    })

    it('should throw NotFoundError when user is not found', async () => {
      mockUserRepo.findById.mockResolvedValue(null)

      await expect(
        updateUserUseCase.execute('nonexistent-id', {
          name: 'Updated Name',
        })
      ).rejects.toThrow(NotFoundError)

      expect(mockUserRepo.findById).toHaveBeenCalledWith('nonexistent-id')
      expect(mockUserRepo.update).not.toHaveBeenCalled()
    })

    it('should throw ConflictError when email already exists', async () => {
      const existingUser = new User('user-1', 'test@example.com', 'Test User')
      const otherUser = new User('user-2', 'other@example.com', 'Other User')

      mockUserRepo.findById.mockResolvedValue(existingUser)
      mockUserRepo.findByEmail.mockResolvedValue(otherUser)

      await expect(
        updateUserUseCase.execute('user-1', {
          email: 'other@example.com',
        })
      ).rejects.toThrow(ConflictError)

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('other@example.com')
      expect(mockUserRepo.update).not.toHaveBeenCalled()
    })

    it('should allow updating email to the same email', async () => {
      const existingUser = new User('user-1', 'test@example.com', 'Test User')
      const updatedUser = new User('user-1', 'test@example.com', 'Updated Name')

      mockUserRepo.findById.mockResolvedValue(existingUser)
      mockUserRepo.update.mockResolvedValue(updatedUser)

      const result = await updateUserUseCase.execute('user-1', {
        email: 'test@example.com',
        name: 'Updated Name',
      })

      expect(result).toEqual(updatedUser)
      expect(mockUserRepo.findByEmail).not.toHaveBeenCalled()
      expect(mockUserRepo.update).toHaveBeenCalled()
    })
  })
})

