import { SessionRepository } from '../domain/repositories/SessionRepository'
import { Session } from '../domain/entities/Session'
import { prisma } from '@/config/database'

export class PrismaSessionRepository implements SessionRepository {
  async findSessionByToken(token: string): Promise<Session | null> {
    const record = await prisma.session.findUnique({
      where: { token }
    })
    if (!record) return null
    return new Session(record.id, record.userId, record.token, record.expiresAt)
  }

  async findSessionById(id: string): Promise<Session | null> {
    const record = await prisma.session.findUnique({
      where: { id }
    })
    if (!record) return null
    return new Session(record.id, record.userId, record.token, record.expiresAt)
  }

  async saveSession(session: Session): Promise<void> {
    await prisma.session.create({
      data: {
        id: session.id,
        userId: session.userId,
        token: session.token,
        expiresAt: session.expiresAt
      }
    })
  }

  async deleteSession(id: string): Promise<void> {
    await prisma.session.delete({ where: { id } }).catch(() => {
      // Ignore if session doesn't exist
    })
  }

  async deleteSessionsByUserId(userId: string): Promise<void> {
    await prisma.session.deleteMany({ where: { userId } })
  }
}

