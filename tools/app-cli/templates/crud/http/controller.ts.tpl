import { Request, Response, NextFunction } from 'express'
import { Create<%= Entity %>UseCase } from '../application/create-<%= entity %>.usecase'
import { Get<%= Entity %>ByIdUseCase } from '../application/get-<%= entity %>-by-id.usecase'
import { List<%= Entity %>sUseCase } from '../application/list-<%= entities %>.usecase'
import { Update<%= Entity %>UseCase } from '../application/update-<%= entity %>.usecase'
import { Delete<%= Entity %>UseCase } from '../application/delete-<%= entity %>.usecase'
import { <%= Entity %>Repository } from '../domain/repositories/<%= Entity %>Repository'
import { validateCreate<%= Entity %>Dto } from './dto/create-<%= entity %>.dto'
import { validateUpdate<%= Entity %>Dto } from './dto/update-<%= entity %>.dto'
import { to<%= Entity %>ResponseDto } from './dto/<%= entity %>-response.dto'
import { uuidSchema } from '@/shared/utils/validation'
import { ValidationError } from '@/shared/errors/ValidationError'

export class <%= Entity %>Controller {
  constructor(private <%= entity %>Repo: <%= Entity %>Repository) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = validateCreate<%= Entity %>Dto(req.body)
      const useCase = new Create<%= Entity %>UseCase(this.<%= entity %>Repo)
      const <%= entity %> = await useCase.execute(dto)
      res.status(201).json(to<%= Entity %>ResponseDto(<%= entity %>))
    } catch (error) {
      next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const parseResult = uuidSchema.safeParse(id)
      if (!parseResult.success) {
        throw new ValidationError('Invalid <%= entity %> ID format', {
          id: ['Invalid UUID format']
        })
      }

      const useCase = new Get<%= Entity %>ByIdUseCase(this.<%= entity %>Repo)
      const <%= entity %> = await useCase.execute(parseResult.data)
      res.json(to<%= Entity %>ResponseDto(<%= entity %>))
    } catch (error) {
      next(error)
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20

      const useCase = new List<%= Entity %>sUseCase(this.<%= entity %>Repo)
      const result = await useCase.execute({ page, limit })
      
      res.json({
        data: result.data.map(to<%= Entity %>ResponseDto),
        pagination: result.pagination
      })
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const parseResult = uuidSchema.safeParse(id)
      if (!parseResult.success) {
        throw new ValidationError('Invalid <%= entity %> ID format', {
          id: ['Invalid UUID format']
        })
      }

      const dto = validateUpdate<%= Entity %>Dto(req.body)
      const useCase = new Update<%= Entity %>UseCase(this.<%= entity %>Repo)
      const <%= entity %> = await useCase.execute(parseResult.data, dto)
      res.json(to<%= Entity %>ResponseDto(<%= entity %>))
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const parseResult = uuidSchema.safeParse(id)
      if (!parseResult.success) {
        throw new ValidationError('Invalid <%= entity %> ID format', {
          id: ['Invalid UUID format']
        })
      }

      const useCase = new Delete<%= Entity %>UseCase(this.<%= entity %>Repo)
      await useCase.execute(parseResult.data)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}

