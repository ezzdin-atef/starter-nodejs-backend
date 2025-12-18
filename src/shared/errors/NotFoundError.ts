import { AppError } from './AppError'

export class NotFoundError extends AppError {
  statusCode = 404

  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with id '${identifier}' not found`
      : `${resource} not found`
    super(message)
  }
}

