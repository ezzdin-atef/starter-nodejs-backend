import { UserRepository } from '@/modules/user/domain/repositories/UserRepository'
import { PasswordService } from '../domain/services/PasswordService'
import { ConflictError } from '@/shared/errors/ConflictError'
import { randomUUID } from 'crypto'
import { prisma } from '@/config/database'

export class RegisterUseCase {
  constructor(
    private userRepo: UserRepository,
    private passwordService: PasswordService
  ) {}

  async execute(data: {
    email: string
    password: string
    name?: string
  }): Promise<{ userId: string; email: string }> {
    // Check if user already exists
    const existing = await this.userRepo.findByEmail(data.email)
    if (existing) {
      throw new ConflictError('User with this email already exists')
    }

    // Use transaction to ensure atomicity
    return await prisma.$transaction(async (tx) => {
      // Create user
      const userId = randomUUID()
      await tx.user.create({
        data: {
          id: userId,
          email: data.email,
          name: data.name
        }
      })

      // Create password
      const passwordHash = await this.passwordService.hash(data.password)
      await tx.password.create({
        data: {
          userId,
          hash: passwordHash
        }
      })

      return { userId, email: data.email }
    })
  }
}

