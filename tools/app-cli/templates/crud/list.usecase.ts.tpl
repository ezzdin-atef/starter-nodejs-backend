import { <%= Entity %>Repository, PaginationOptions, PaginatedResult } from '../domain/repositories/<%= Entity %>Repository'
import { <%= Entity %> } from '../domain/entities/<%= Entity %>'

export class List<%= Entity %>sUseCase {
  constructor(private <%= entity %>Repo: <%= Entity %>Repository) {}

  async execute(options?: PaginationOptions): Promise<PaginatedResult<<%= Entity %>>> {
    return await this.<%= entity %>Repo.findAll(options)
  }
}

