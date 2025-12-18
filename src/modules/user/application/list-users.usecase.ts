import { UserRepository, PaginationOptions, PaginatedResult } from '../domain/repositories/UserRepository'
import { User } from '../domain/entities/User'

export class ListUsersUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(options?: PaginationOptions): Promise<PaginatedResult<User>> {
    return await this.userRepo.findAll(options)
  }
}

