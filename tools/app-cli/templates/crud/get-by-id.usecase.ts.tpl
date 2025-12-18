import { <%= Entity %>Repository } from '../domain/repositories/<%= Entity %>Repository'
import { NotFoundError } from '@/shared/errors/NotFoundError'

export class Get<%= Entity %>ByIdUseCase {
  constructor(private <%= entity %>Repo: <%= Entity %>Repository) {}

  async execute(id: string) {
    const <%= entity %> = await this.<%= entity %>Repo.findById(id)
    if (!<%= entity %>) {
      throw new NotFoundError('<%= Entity %>', id)
    }
    return <%= entity %>
  }
}

