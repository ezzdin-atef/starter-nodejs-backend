import { AccountRepository } from '../domain/repositories/AccountRepository'
import { Account, AuthProvider } from '../domain/entities/Account'
import { prisma } from '@/config/database'

export class PrismaAccountRepository implements AccountRepository {
  async findAccountByProvider(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<Account | null> {
    const record = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId
        }
      }
    })
    if (!record) return null
    return new Account(
      record.id,
      record.userId,
      record.provider as AuthProvider,
      record.providerAccountId,
      record.accessToken || undefined,
      record.refreshToken || undefined,
      record.expiresAt || undefined
    )
  }

  async findAccountsByUserId(userId: string): Promise<Account[]> {
    const records = await prisma.account.findMany({
      where: { userId }
    })
    return records.map(
      (record) =>
        new Account(
          record.id,
          record.userId,
          record.provider as AuthProvider,
          record.providerAccountId,
          record.accessToken || undefined,
          record.refreshToken || undefined,
          record.expiresAt || undefined
        )
    )
  }

  async saveAccount(account: Account): Promise<void> {
    await prisma.account.create({
      data: {
        id: account.id,
        userId: account.userId,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        expiresAt: account.expiresAt
      }
    })
  }

  async deleteAccount(id: string): Promise<void> {
    await prisma.account.delete({ where: { id } }).catch(() => {
      // Ignore if account doesn't exist
    })
  }
}

