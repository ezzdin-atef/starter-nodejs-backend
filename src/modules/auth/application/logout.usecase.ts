import { SessionRepository } from '../domain/repositories/SessionRepository'
import { UnauthorizedError } from '../domain/errors/UnauthorizedError'

export class LogoutUseCase {
  constructor(private sessionRepo: SessionRepository) {}

  async execute(refreshToken: string): Promise<void> {
    const session = await this.sessionRepo.findSessionByToken(refreshToken)
    if (!session) {
      throw new UnauthorizedError('Session not found')
    }

    await this.sessionRepo.deleteSession(session.id)
  }
}

