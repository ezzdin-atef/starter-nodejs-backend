import { Router } from 'express'
import { <%= Entity %>Controller } from './<%= module %>.controller'
import { Prisma<%= Entity %>Repository } from '@/modules/<%= moduleName %>/persistence/prisma-<%= entity %>.repository'

const router = Router()
const controller = new <%= Entity %>Controller(new Prisma<%= Entity %>Repository())

// TODO: Add authentication middleware if needed
// router.use(requireAuth)

router.get('/', controller.list.bind(controller))
router.get('/:id', controller.getById.bind(controller))
router.post('/', controller.create.bind(controller))
router.patch('/:id', controller.update.bind(controller))
router.delete('/:id', controller.delete.bind(controller))

export { router as <%= module %>Routes }

