import { AppError } from '@/shared/errors/AppError'

export class InvalidProductError extends AppError {
  statusCode = 400

  constructor(message: string = 'InvalidProduct') {
    super(message)
  }
}

