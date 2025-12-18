import { Router } from 'express'
import { <%= Entity %>Controller } from './<%= module %>.controller'

const router = Router()
const controller = new <%= Entity %>Controller()

// TODO: Add routes
// router.get('/', controller.example.bind(controller))

export { router as <%= module %>Routes }

