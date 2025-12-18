import { AppError } from '@/shared/errors/AppError'

export class Productnotfounderror extends AppError {
  statusCode = 404

  constructor(message: string = 'Product not found') {
    super(message)
  }
}

