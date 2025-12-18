import { PasswordRepository } from '../domain/repositories/PasswordRepository'
import { Password } from '../domain/entities/Password'
import { prisma } from '@/config/database'

export class PrismaPasswordRepository implements PasswordRepository {
  async findPasswordByUserId(userId: string): Promise<Password | null> {
    const record = await prisma.password.findUnique({
      where: { userId }
    })
    if (!record) return null
    return new Password(record.userId, record.hash)
  }

  async savePassword(password: Password): Promise<void> {
    await prisma.password.create({
      data: {
        userId: password.userId,
        hash: password.hash
      }
    })
  }

  async updatePassword(userId: string, hash: string): Promise<void> {
    await prisma.password.upsert({
      where: { userId },
      create: { userId, hash },
      update: { hash }
    })
  }

  async deletePassword(userId: string): Promise<void> {
    await prisma.password.delete({ where: { userId } }).catch(() => {
      // Ignore if password doesn't exist
    })
  }
}

