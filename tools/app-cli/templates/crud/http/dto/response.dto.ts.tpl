import { <%= Entity %> } from '../../domain/entities/<%= Entity %>'

export interface <%= Entity %>ResponseDto {
  id: string
  createdAt: string
  updatedAt: string
}

export function to<%= Entity %>ResponseDto(<%= entity %>: <%= Entity %>): <%= Entity %>ResponseDto {
  return {
    id: <%= entity %>.id,
    createdAt: <%= entity %>.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: <%= entity %>.updatedAt?.toISOString() || new Date().toISOString()
  }
}

