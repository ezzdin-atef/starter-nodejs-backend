import { AppError } from '@/shared/errors/AppError'

export class <%= ErrorName %> extends AppError {
  statusCode = <%= statusCode %>

  constructor(message: string = '<%= defaultMessage %>') {
    super(message)
  }
}

