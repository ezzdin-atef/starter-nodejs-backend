import { PasswordRepository } from '../domain/repositories/PasswordRepository'
import { SessionRepository } from '../domain/repositories/SessionRepository'
import { PasswordResetRepository } from '../domain/repositories/PasswordResetRepository'
import { PasswordService } from '../domain/services/PasswordService'
import { UnauthorizedError } from '../domain/errors/UnauthorizedError'
import { NotFoundError } from '@/shared/errors/NotFoundError'

export class ResetPasswordUseCase {
  constructor(
    private passwordResetRepo: PasswordResetRepository,
    private passwordRepo: PasswordRepository,
    private sessionRepo: SessionRepository,
    private passwordService: PasswordService
  ) {}

  async execute(data: {
    resetToken: string
    newPassword: string
  }): Promise<void> {
    // Find the reset token in database
    const resetToken = await this.passwordResetRepo.findPasswordResetTokenByToken(data.resetToken)
    
    if (!resetToken) {
      throw new UnauthorizedError('Invalid or expired reset token')
    }

    // Check if token is valid (not used and not expired)
    if (!resetToken.isValid()) {
      throw new UnauthorizedError('Invalid or expired reset token')
    }

    // Check if user has a password (should exist)
    const password = await this.passwordRepo.findPasswordByUserId(resetToken.userId)
    if (!password) {
      throw new NotFoundError('User', resetToken.userId)
    }

    // Mark token as used before updating password (prevents reuse)
    await this.passwordResetRepo.markPasswordResetTokenAsUsed(resetToken.id)

    // Hash new password
    const newHash = await this.passwordService.hash(data.newPassword)

    // Update password
    await this.passwordRepo.updatePassword(resetToken.userId, newHash)

    // Invalidate all sessions for security
    await this.sessionRepo.deleteSessionsByUserId(resetToken.userId)
  }
}

