import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError'
import { ValidationError } from '../errors/ValidationError'
import { logger } from '@/config/logger'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  logger.error('Unhandled error', {
    requestId: req.requestId,
    statusCode: statusCode,
    message: err.message,
    stack: err.stack
  })
  
  if (err instanceof AppError) {
    const response: {
      message: string
      statusCode: number
      errors?: Record<string, string[]>
    } = {
      message: err.message,
      statusCode: err.statusCode
    }

    if (err instanceof ValidationError && err.errors) {
      response.errors = err.errors
    }

    return res.status(err.statusCode).json({
      error: response
    })
  }

  // Unexpected errors

  res.status(500).json({
    error: {
      requestId: req.requestId,
      message: 'Internal server error',
      statusCode: 500,
    }
  })
}

