import { z } from 'zod'
import { ValidationError } from '@/shared/errors/ValidationError'

export const loginSchema = z.object({
  email: z.string().email('Email must be a valid email address').trim(),
  password: z.string().min(1, 'Password is required')
})

export type LoginDto = z.infer<typeof loginSchema>

export function validateLoginDto(data: unknown): LoginDto {
  try {
    return loginSchema.parse(data)
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

