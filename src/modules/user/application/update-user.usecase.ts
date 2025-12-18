import { UserRepository } from '../domain/repositories/UserRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'
import { ConflictError } from '@/shared/errors/ConflictError'

export class UpdateUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(id: string, data: { email?: string; name?: string; avatarUrl?: string }) {
    const existing = await this.userRepo.findById(id)
    if (!existing) {
      throw new NotFoundError('User', id)
    }

    // Check if email is being updated and if it conflicts with another user
    if (data.email && data.email !== existing.email) {
      const emailUser = await this.userRepo.findByEmail(data.email)
      if (emailUser) {
        throw new ConflictError('Email already exists')
      }
    }

    return await this.userRepo.update(id, data)
  }
}

