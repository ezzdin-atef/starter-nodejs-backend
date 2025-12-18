import { PasswordResetToken } from '../entities/PasswordResetToken'

export interface PasswordResetRepository {
  savePasswordResetToken(token: PasswordResetToken): Promise<void>
  findPasswordResetTokenByToken(token: string): Promise<PasswordResetToken | null>
  markPasswordResetTokenAsUsed(tokenId: string): Promise<void>
  deleteExpiredPasswordResetTokens(): Promise<void>
}

