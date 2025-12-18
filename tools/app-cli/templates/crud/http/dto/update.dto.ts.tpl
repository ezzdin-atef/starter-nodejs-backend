import { z } from 'zod'
import { ValidationError } from '@/shared/errors/ValidationError'

export const update<%= Entity %>Schema = z.object({
  // TODO: Add fields specific to <%= Entity %>
}).partial()

export type Update<%= Entity %>Dto = z.infer<typeof update<%= Entity %>Schema>

export function validateUpdate<%= Entity %>Dto(data: unknown): Update<%= Entity %>Dto {
  try {
    return update<%= Entity %>Schema.parse(data)
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

