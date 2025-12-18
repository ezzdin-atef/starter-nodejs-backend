import { Express } from 'express'
import { authRoutes } from './http/auth.routes'

export const authModule = {
  register(app: Express) {
    app.use('/api/v1/auth', authRoutes)
  }
}

