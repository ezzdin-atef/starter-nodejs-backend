import { z } from 'zod'
import { ValidationError } from '@/shared/errors/ValidationError'

export const requestPasswordResetSchema = z.object({
  email: z.string().email('Email must be a valid email address').trim()
})

export type RequestPasswordResetDto = z.infer<typeof requestPasswordResetSchema>

export function validateRequestPasswordResetDto(
  data: unknown
): RequestPasswordResetDto {
  try {
    return requestPasswordResetSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(issue.message)
      })
      throw new ValidationError('Validation failed', errors)
    }
    throw error
  }
}

export const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
})

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>

export function validateResetPasswordDto(data: unknown): ResetPasswordDto {
  try {
    return resetPasswordSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.issues.forEach((issue) => {
        const path = issue.path.join('.')
        if (!errors[path]) {
          errors[path] = []
        }
        errors[path].push(issue.message)
      })
      throw new ValidationError('Validation failed', errors)
    }
    throw error
  }
}

