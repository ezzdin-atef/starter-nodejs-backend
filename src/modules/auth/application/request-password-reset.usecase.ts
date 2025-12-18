import { UserRepository } from '@/modules/user/domain/repositories/UserRepository'
import { PasswordResetRepository } from '../domain/repositories/PasswordResetRepository'
import { EmailService } from '../domain/services/EmailService'
import { PasswordResetToken } from '../domain/entities/PasswordResetToken'
import { generatePasswordResetEmail } from '../infrastructure/email-templates'
import { env } from '@/config/env'
import { randomUUID } from 'crypto'

export class RequestPasswordResetUseCase {
  constructor(
    private userRepo: UserRepository,
    private passwordResetRepo: PasswordResetRepository,
    private emailService: EmailService
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email)
    if (!user) {
      // Don't reveal if user exists or not for security
      // Return silently to prevent email enumeration
      return
    }

    // Generate a secure random token
    const token = randomUUID() + randomUUID() // 64 character token
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    // Create and save password reset token
    const resetToken = new PasswordResetToken(
      randomUUID(),
      user.id,
      token,
      expiresAt
    )

    await this.passwordResetRepo.savePasswordResetToken(resetToken)

    // Generate password reset link
    const frontendUrl = env.FRONTEND_URL || env.PRODUCTION_URL || 'http://localhost:3000'
    const resetLink = `${frontendUrl}/reset-password?token=${token}`

    // Generate email content
    const emailContent = generatePasswordResetEmail({
      userName: user.name,
      resetLink,
      expiresIn: '1 hour'
    })

    // Send password reset email
    try {
      await this.emailService.sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      })
    } catch (error) {
      // Log error but don't fail the request to prevent email enumeration
      // In production, you might want to handle this differently
      console.error('Failed to send password reset email:', error)
      // Optionally, you could throw an error here if email sending is critical
    }
  }
}

