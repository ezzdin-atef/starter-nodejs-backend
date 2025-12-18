import { User } from '../entities/User'

export interface PaginationOptions {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  findAll(options?: PaginationOptions): Promise<PaginatedResult<User>>
  save(user: User): Promise<void>
  update(id: string, data: Partial<User>): Promise<User>
  delete(id: string): Promise<void>
}

