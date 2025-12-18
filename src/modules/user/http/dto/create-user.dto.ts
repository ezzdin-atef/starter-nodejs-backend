import { z } from 'zod'
import { ValidationError } from '@/shared/errors/ValidationError'

export const createUserSchema = z.object({
  email: z.email('Email must be a valid email address').trim(),
  name: z.string().max(255, 'Name must be less than 255 characters').trim().optional(),
  avatarUrl: z.url('Avatar URL must be a valid URL').trim().optional()
})

export type CreateUserDto = z.infer<typeof createUserSchema>

export function validateCreateUserDto(data: unknown): CreateUserDto {
  try {
    return createUserSchema.parse(data)
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

