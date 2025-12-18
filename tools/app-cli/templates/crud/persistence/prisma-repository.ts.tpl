import { <%= Entity %>Repository, PaginationOptions, PaginatedResult } from '../domain/repositories/<%= Entity %>Repository'
import { <%= Entity %> } from '../domain/entities/<%= Entity %>'
import { prisma } from '@/config/database'

export class Prisma<%= Entity %>Repository implements <%= Entity %>Repository {

  async findById(id: string): Promise<<%= Entity %> | null> {
    const record = await prisma.<%= entity %>.findUnique({ where: { id } })
    if (!record) return null

    return new <%= Entity %>(
      record.id,
      record.createdAt,
      record.updatedAt
    )
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<<%= Entity %>>> {
    const page = options?.page || 1
    const limit = options?.limit || 20

    // Validate pagination parameters
    const validLimit = Math.min(Math.max(1, limit), 100) // Between 1 and 100
    const validPage = Math.max(1, page)

    const [records, total] = await Promise.all([
      prisma.<%= entity %>.findMany({
        skip: (validPage - 1) * validLimit,
        take: validLimit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.<%= entity %>.count()
    ])

    const data = records.map(
      (record) =>
        new <%= Entity %>(
          record.id,
          record.createdAt,
          record.updatedAt
        )
    )

    return {
      data,
      pagination: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages: Math.ceil(total / validLimit)
      }
    }
  }

  async save(<%= entity %>: <%= Entity %>): Promise<void> {
    await prisma.<%= entity %>.create({
      data: {
        id: <%= entity %>.id
        // TODO: Add other fields
      }
    })
  }

  async update(id: string, data: Partial<<%= Entity %>>): Promise<<%= Entity %>> {
    const updateData: Record<string, any> = {}

    // TODO: Map entity fields to Prisma update data

    const record = await prisma.<%= entity %>.update({
      where: { id },
      data: updateData
    })

    return new <%= Entity %>(
      record.id,
      record.createdAt,
      record.updatedAt
    )
  }

  async delete(id: string): Promise<void> {
    await prisma.<%= entity %>.delete({ where: { id } })
  }
}

