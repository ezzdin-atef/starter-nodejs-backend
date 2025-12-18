import { PasswordResetRepository } from '../domain/repositories/PasswordResetRepository'
import { PasswordResetToken } from '../domain/entities/PasswordResetToken'
import { prisma } from '@/config/database'

export class PrismaPasswordResetRepository implements PasswordResetRepository {
  async savePasswordResetToken(token: PasswordResetToken): Promise<void> {
    await prisma.passwordResetToken.create({
      data: {
        id: token.id,
        userId: token.userId,
        token: token.token,
        expiresAt: token.expiresAt,
        used: token.used
      }
    })
  }

  async findPasswordResetTokenByToken(token: string): Promise<PasswordResetToken | null> {
    const record = await prisma.passwordResetToken.findUnique({
      where: { token }
    })
    if (!record) return null
    return new PasswordResetToken(
      record.id,
      record.userId,
      record.token,
      record.expiresAt,
      record.used,
      record.createdAt
    )
  }

  async markPasswordResetTokenAsUsed(tokenId: string): Promise<void> {
    await prisma.passwordResetToken.update({
      where: { id: tokenId },
      data: { used: true }
    })
  }

  async deleteExpiredPasswordResetTokens(): Promise<void> {
    await prisma.passwordResetToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    })
  }
}

