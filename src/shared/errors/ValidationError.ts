import { AppError } from './AppError'

export class ValidationError extends AppError {
  statusCode = 400

  constructor(message: string, public readonly errors?: Record<string, string[]>) {
    super(message)
  }
}

