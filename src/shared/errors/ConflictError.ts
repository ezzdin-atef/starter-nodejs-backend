import { AppError } from './AppError'

export class ConflictError extends AppError {
  statusCode = 409

  constructor(message: string) {
    super(message)
  }
}

