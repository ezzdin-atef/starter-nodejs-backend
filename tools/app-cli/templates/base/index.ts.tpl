import { Express } from 'express'
import { <%= module %>Routes } from './http/<%= module %>.routes'

export const <%= module %>Module = {
  register(app: Express) {
    app.use('<%= routePath %>', <%= module %>Routes)
  }
}

