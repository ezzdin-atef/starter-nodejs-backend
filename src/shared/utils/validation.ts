import { z } from 'zod'

export const uuidSchema = z.uuid('Invalid UUID format')

export function isValidUUID(uuid: string): boolean {
  return uuidSchema.safeParse(uuid).success
}
