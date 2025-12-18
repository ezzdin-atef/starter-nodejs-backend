import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { CreateUserUseCase } from './create-user.usecase'
import { UserRepository } from '../domain/repositories/UserRepository'
import { ConflictError } from '@/shared/errors/ConflictError'
import { User } from '../domain/entities/User'

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase
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

    createUserUseCase = new CreateUserUseCase(mockUserRepo)
  })

  describe('execute', () => {
    it('should successfully create a new user', async () => {
      const email = 'newuser@example.com'
      const name = 'New User'
      const avatarUrl = 'https://example.com/avatar.jpg'

      mockUserRepo.findByEmail.mockResolvedValue(null)
      mockUserRepo.save.mockResolvedValue(undefined)

      const result = await createUserUseCase.execute({
        email,
        name,
        avatarUrl,
      })

      expect(result).toBeInstanceOf(User)
      expect(result.email).toBe(email)
      expect(result.name).toBe(name)
      expect(result.avatarUrl).toBe(avatarUrl)
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(email)
      expect(mockUserRepo.save).toHaveBeenCalled()
    })

    it('should throw ConflictError when email already exists', async () => {
      const existingUser = new User('user-1', 'existing@example.com', 'Existing User')
      mockUserRepo.findByEmail.mockResolvedValue(existingUser)

      await expect(
        createUserUseCase.execute({
          email: 'existing@example.com',
          name: 'New User',
        })
      ).rejects.toThrow(ConflictError)

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('existing@example.com')
      expect(mockUserRepo.save).not.toHaveBeenCalled()
    })
  })
})

