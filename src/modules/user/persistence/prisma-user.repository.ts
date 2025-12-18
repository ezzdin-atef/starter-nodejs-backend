import { UserRepository, PaginationOptions, PaginatedResult } from '../domain/repositories/UserRepository'
import { User } from '../domain/entities/User'
import { prisma } from '@/config/database'

export class PrismaUserRepository implements UserRepository {

  async findByEmail(email: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { email } })
    if (!record) return null

    return new User(
      record.id,
      record.email || '',
      record.name || undefined,
      record.avatarUrl || undefined,
      record.emailVerified || undefined,
      record.createdAt,
      record.updatedAt
    )
  }

  async findById(id: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { id } })
    if (!record) return null

    return new User(
      record.id,
      record.email || '',
      record.name || undefined,
      record.avatarUrl || undefined,
      record.emailVerified || undefined,
      record.createdAt,
      record.updatedAt
    )
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<User>> {
    const page = options?.page || 1
    const limit = options?.limit || 20
    const skip = (page - 1) * limit

    // Validate pagination parameters
    const validLimit = Math.min(Math.max(1, limit), 100) // Between 1 and 100
    const validPage = Math.max(1, page)

    const [records, total] = await Promise.all([
      prisma.user.findMany({
        skip: (validPage - 1) * validLimit,
        take: validLimit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count()
    ])

    const data = records.map(
      (record) =>
        new User(
          record.id,
          record.email || '',
          record.name || undefined,
          record.avatarUrl || undefined,
          record.emailVerified || undefined,
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

  async save(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl
      }
    })
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const updateData: {
      email?: string
      name?: string | null
      avatarUrl?: string | null
    } = {}

    if (data.email !== undefined) updateData.email = data.email
    if (data.name !== undefined) updateData.name = data.name || null
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl || null

    const record = await prisma.user.update({
      where: { id },
      data: updateData
    })

    return new User(
      record.id,
      record.email || '',
      record.name || undefined,
      record.avatarUrl || undefined,
      record.emailVerified || undefined,
      record.createdAt,
      record.updatedAt
    )
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } })
  }
}