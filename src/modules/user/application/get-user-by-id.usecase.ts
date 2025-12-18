import { UserRepository } from '../domain/repositories/UserRepository'
import { NotFoundError } from '@/shared/errors/NotFoundError'

export class GetUserByIdUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id)
    if (!user) {
      throw new NotFoundError('User', id)
    }
    return user
  }
}

