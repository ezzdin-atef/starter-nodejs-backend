export abstract class AppError extends Error {
  abstract statusCode: number

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

