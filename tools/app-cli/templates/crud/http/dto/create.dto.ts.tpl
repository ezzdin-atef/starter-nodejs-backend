import { z } from 'zod'
import { ValidationError } from '@/shared/errors/ValidationError'

export const create<%= Entity %>Schema = z.object({
  // TODO: Add fields specific to <%= Entity %>
})

export type Create<%= Entity %>Dto = z.infer<typeof create<%= Entity %>Schema>

export function validateCreate<%= Entity %>Dto(data: unknown): Create<%= Entity %>Dto {
  try {
    return create<%= Entity %>Schema.parse(data)
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

