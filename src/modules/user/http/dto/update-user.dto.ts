import { z } from 'zod'
import { ValidationError } from '@/shared/errors/ValidationError'

export const updateUserSchema = z.object({
  email: z.string().email('Email must be a valid email address').trim().optional(),
  name: z.string().max(255, 'Name must be less than 255 characters').trim().optional(),
  avatarUrl: z.string().url('Avatar URL must be a valid URL').trim().optional()
})

export type UpdateUserDto = z.infer<typeof updateUserSchema>

export function validateUpdateUserDto(data: unknown): UpdateUserDto {
  try {
    return updateUserSchema.parse(data)
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

