import { Password } from '../entities/Password'

export interface PasswordRepository {
  findPasswordByUserId(userId: string): Promise<Password | null>
  savePassword(password: Password): Promise<void>
  updatePassword(userId: string, hash: string): Promise<void>
  deletePassword(userId: string): Promise<void>
}

