import { <%= Entity %>Repository } from '../domain/repositories/<%= Entity %>Repository'
import { <%= Entity %> } from '../domain/entities/<%= Entity %>'
import { randomUUID } from 'crypto'

export class Create<%= Entity %>UseCase {
  constructor(private <%= entity %>Repo: <%= Entity %>Repository) {}

  async execute(data: Record<string, any>): Promise<<%= Entity %>> {
    // TODO: implement validation and business logic
    const <%= entity %> = new <%= Entity %>(randomUUID())
    await this.<%= entity %>Repo.save(<%= entity %>)
    return <%= entity %>
  }
}
