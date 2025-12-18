import { Router } from 'express'
import { UserController } from './user.controller'
import { requireAuth } from '@/modules/auth/http/middleware/auth.middleware.factory'
import { PrismaUserRepository } from '@/modules/user/persistence/prisma-user.repository'

const router = Router()
const controller = new UserController(new PrismaUserRepository())

// All user routes require authentication
router.use(requireAuth)

router.get('/', controller.list.bind(controller))
router.get('/:id', controller.getById.bind(controller))
router.post('/', controller.create.bind(controller))
router.patch('/:id', controller.update.bind(controller))
router.delete('/:id', controller.delete.bind(controller))

export { router as userRoutes }