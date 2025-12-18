import { <%= Entity %>Repository } from '../domain/repositories/<%= Entity %>Repository'
import { NotFoundError } from '@/shared/errors/NotFoundError'

export class Delete<%= Entity %>UseCase {
  constructor(private <%= entity %>Repo: <%= Entity %>Repository) {}

  async execute(id: string) {
    const <%= entity %> = await this.<%= entity %>Repo.findById(id)
    if (!<%= entity %>) {
      throw new NotFoundError('<%= Entity %>', id)
    }
    await this.<%= entity %>Repo.delete(id)
  }
}

