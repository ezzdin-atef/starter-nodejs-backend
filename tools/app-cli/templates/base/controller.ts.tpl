import { Request, Response, NextFunction } from 'express'

export class <%= Entity %>Controller {
  constructor() {}

  // TODO: Add controller methods
  async example(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Implement
      res.json({ message: 'Hello from <%= Entity %>Controller' })
    } catch (error) {
      next(error)
    }
  }
}

