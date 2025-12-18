import { AppError } from '@/shared/errors/AppError'

export class InvalidCredentialsError extends AppError {
  statusCode = 401

  constructor(message: string = 'Invalid credentials') {
    super(message)
  }
}

