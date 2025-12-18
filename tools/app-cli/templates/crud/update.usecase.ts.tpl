import { <%= Entity %>Repository } from '../domain/repositories/<%= Entity %>Repository'
import { NotFoundError } from '@/shared/errors/NotFoundError'

export class Update<%= Entity %>UseCase {
  constructor(private <%= entity %>Repo: <%= Entity %>Repository) {}

  async execute(id: string, data: Record<string, any>) {
    const existing = await this.<%= entity %>Repo.findById(id)
    if (!existing) {
      throw new NotFoundError('<%= Entity %>', id)
    }

    return await this.<%= entity %>Repo.update(id, data)
  }
}

