import { Session } from '../entities/Session'

export interface SessionRepository {
  findSessionByToken(token: string): Promise<Session | null>
  findSessionById(id: string): Promise<Session | null>
  saveSession(session: Session): Promise<void>
  deleteSession(id: string): Promise<void>
  deleteSessionsByUserId(userId: string): Promise<void>
}

