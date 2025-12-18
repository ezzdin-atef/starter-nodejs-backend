import { z } from 'zod'
import { ValidationError } from '@/shared/errors/ValidationError'

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
})

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>

export function validateRefreshTokenDto(data: unknown): RefreshTokenDto {
  try {
    return refreshTokenSchema.parse(data)
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

