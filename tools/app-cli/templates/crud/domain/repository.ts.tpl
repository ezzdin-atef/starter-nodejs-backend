import { <%= Entity %> } from '../entities/<%= Entity %>'

export interface PaginationOptions {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface <%= Entity %>Repository {
  findById(id: string): Promise<<%= Entity %> | null>
  findAll(options?: PaginationOptions): Promise<PaginatedResult<<%= Entity %>>>
  save(<%= entity %>: <%= Entity %>): Promise<void>
  update(id: string, data: Partial<<%= Entity %>>): Promise<<%= Entity %>>
  delete(id: string): Promise<void>
}

