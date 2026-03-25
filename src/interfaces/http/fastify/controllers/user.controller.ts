import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreateUserInput, UpdateUserInput } from '../../../../core/users/domain/entities/user.entity'
import { CreateUserUseCase } from '../../../../core/users/application/use-cases/create-user.usecase'
import { DeleteUserUseCase } from '../../../../core/users/application/use-cases/delete.usecase'
import { GetUserByIdUseCase } from '../../../../core/users/application/use-cases/get-user-by-id.usecase'
import { ListUsersUseCase } from '../../../../core/users/application/use-cases/list-users.usecase'
import { UpdateUserUseCase } from '../../../../core/users/application/use-cases/update-user.usecase'
import type { UserRepository } from '../../../../core/users/domain/repositories/user.repository'

export interface PaginationQuery {
  offset?: string
  limit?: string
}

export interface IdParams {
  id: string
}

export class UserController {
  constructor(private readonly repository: UserRepository) {}

  async list(req: FastifyRequest<{ Querystring: PaginationQuery }>, res: FastifyReply): Promise<void> {
    const offset = parseInt(req.query.offset ?? '0')
    const limit = parseInt(req.query.limit ?? '10')

    const useCase = new ListUsersUseCase(this.repository)
    const users = await useCase.execute(offset, limit)

    res.status(200).send({ data: users })
  }

  async getById(req: FastifyRequest<{ Params: IdParams }>, res: FastifyReply): Promise<void> {
    const { id } = req.params

    const useCase = new GetUserByIdUseCase(this.repository)
    const user = await useCase.execute(id)

    res.status(200).send({ data: user })
  }

  async create(req: FastifyRequest<{ Body: CreateUserInput }>, res: FastifyReply): Promise<void> {
    const input = req.body

    const useCase = new CreateUserUseCase(this.repository)
    const user = await useCase.execute(input)

    res.status(201).send({ data: { id: user.id } })
  }

  async update(req: FastifyRequest<{ Params: IdParams; Body: UpdateUserInput }>, res: FastifyReply): Promise<void> {
    const { id } = req.params
    const input = req.body

    const useCase = new UpdateUserUseCase(this.repository)
    await useCase.execute(id, input)

    res.status(200).send({ data: { id } })
  }

  async delete(req: FastifyRequest<{ Params: IdParams }>, res: FastifyReply): Promise<void> {
    const { id } = req.params

    const useCase = new DeleteUserUseCase(this.repository)
    await useCase.execute(id)

    res.status(200).send({ data: { id } })
  }
}
