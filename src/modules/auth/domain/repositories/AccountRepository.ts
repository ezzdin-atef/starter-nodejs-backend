import { Account, AuthProvider } from '../entities/Account'

export interface AccountRepository {
  findAccountByProvider(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<Account | null>
  findAccountsByUserId(userId: string): Promise<Account[]>
  saveAccount(account: Account): Promise<void>
  deleteAccount(id: string): Promise<void>
}

