import { AppError } from '@/shared/errors/AppError'

export class UnauthorizedError extends AppError {
  statusCode = 401

  constructor(message: string = 'Unauthorized') {
    super(message)
  }
}

