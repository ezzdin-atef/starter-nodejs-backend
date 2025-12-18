import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { ListUsersUseCase } from './list-users.usecase'
import { UserRepository } from '../domain/repositories/UserRepository'
import { User } from '../domain/entities/User'

describe('ListUsersUseCase', () => {
  let listUsersUseCase: ListUsersUseCase
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

    listUsersUseCase = new ListUsersUseCase(mockUserRepo)
  })

  describe('execute', () => {
    it('should successfully list users with pagination', async () => {
      const users = [
        new User('user-1', 'user1@example.com', 'User 1'),
        new User('user-2', 'user2@example.com', 'User 2'),
      ]
      const paginatedResult = {
        data: users,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      }

      mockUserRepo.findAll.mockResolvedValue(paginatedResult)

      const result = await listUsersUseCase.execute({ page: 1, limit: 10 })

      expect(result).toEqual(paginatedResult)
      expect(mockUserRepo.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 })
    })

    it('should return empty result when no users exist', async () => {
      const emptyResult = {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      }

      mockUserRepo.findAll.mockResolvedValue(emptyResult)

      const result = await listUsersUseCase.execute({ page: 1, limit: 10 })

      expect(result).toEqual(emptyResult)
      expect(result.data).toHaveLength(0)
    })

    it('should work without pagination options', async () => {
      const users = [new User('user-1', 'user1@example.com', 'User 1')]
      const paginatedResult = {
        data: users,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      }

      mockUserRepo.findAll.mockResolvedValue(paginatedResult)

      const result = await listUsersUseCase.execute()

      expect(result).toEqual(paginatedResult)
      expect(mockUserRepo.findAll).toHaveBeenCalledWith(undefined)
    })
  })
})

