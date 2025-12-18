import { UserRepository } from '../domain/repositories/UserRepository'
import { User } from '../domain/entities/User'
import { randomUUID } from 'crypto'
import { ConflictError } from '@/shared/errors/ConflictError'

export class CreateUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(data: {
    email: string
    name?: string
    avatarUrl?: string
  }): Promise<User> {
    const existing = await this.userRepo.findByEmail(data.email)
    if (existing) {
      throw new ConflictError('User already exists')
    }

    const user = new User(randomUUID(), data.email, data.name, data.avatarUrl)
    await this.userRepo.save(user)

    return user
  }
}