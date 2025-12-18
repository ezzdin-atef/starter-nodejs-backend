import { Express } from 'express'
import { userRoutes } from './http/user.routes'

export const userModule = {
  register(app: Express) {
    app.use('/api/v1/users', userRoutes)
  }
}