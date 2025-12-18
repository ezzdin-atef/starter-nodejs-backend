import { Request, Response, NextFunction } from 'express'
import { CreateUserUseCase } from '../application/create-user.usecase'
import { GetUserByIdUseCase } from '../application/get-user-by-id.usecase'
import { ListUsersUseCase } from '../application/list-users.usecase'
import { UpdateUserUseCase } from '../application/update-user.usecase'
import { DeleteUserUseCase } from '../application/delete-user.usecase'
import { UserRepository } from '../domain/repositories/UserRepository'
import { validateCreateUserDto } from './dto/create-user.dto'
import { validateUpdateUserDto } from './dto/update-user.dto'
import { toUserResponseDto } from './dto/user-response.dto'
import { uuidSchema } from '@/shared/utils/validation'
import { ValidationError } from '@/shared/errors/ValidationError'
import { UnauthorizedError } from '@/modules/auth/domain/errors/UnauthorizedError'

export class UserController {
  constructor(private userRepo: UserRepository) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = validateCreateUserDto(req.body)
      const useCase = new CreateUserUseCase(this.userRepo)
      const user = await useCase.execute(dto)
      res.status(201).json(toUserResponseDto(user))
    } catch (error) {
      next(error)
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const parseResult = uuidSchema.safeParse(id)
      if (!parseResult.success) {
        throw new ValidationError('Invalid user ID format', {
          id: ['Invalid UUID format']
        })
      }

      // Users can only access their own data
      if (req.userId !== parseResult.data) {
        throw new UnauthorizedError('You can only access your own user data')
      }

      const useCase = new GetUserByIdUseCase(this.userRepo)
      const user = await useCase.execute(parseResult.data)
      res.json(toUserResponseDto(user))
    } catch (error) {
      next(error)
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20

      const useCase = new ListUsersUseCase(this.userRepo)
      const result = await useCase.execute({ page, limit })
      
      res.json({
        data: result.data.map(toUserResponseDto),
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
        throw new ValidationError('Invalid user ID format', {
          id: ['Invalid UUID format']
        })
      }

      // Users can only update their own data
      if (req.userId !== parseResult.data) {
        throw new UnauthorizedError('You can only update your own user data')
      }

      const dto = validateUpdateUserDto(req.body)
      const useCase = new UpdateUserUseCase(this.userRepo)
      const user = await useCase.execute(parseResult.data, dto)
      res.json(toUserResponseDto(user))
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      const parseResult = uuidSchema.safeParse(id)
      if (!parseResult.success) {
        throw new ValidationError('Invalid user ID format', {
          id: ['Invalid UUID format']
        })
      }

      // Users can only delete their own account
      if (req.userId !== parseResult.data) {
        throw new UnauthorizedError('You can only delete your own account')
      }

      const useCase = new DeleteUserUseCase(this.userRepo)
      await useCase.execute(parseResult.data)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}