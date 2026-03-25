import type { FastifyReply, FastifyRequest } from 'fastify'
import { DeleteUserUseCase } from '../../../../core/users/application/use-cases/delete.usecase'
import { FindByEmailUseCase } from '../../../../core/users/application/use-cases/find-by-email.usecase'
import { FindByIdUseCase } from '../../../../core/users/application/use-cases/find-by-id.usecase'
import { ListUsersUseCase } from '../../../../core/users/application/use-cases/list.usecase'
import { LoginUserUseCase } from '../../../../core/users/application/use-cases/login.usecase'
import { RegisterUserUseCase } from '../../../../core/users/application/use-cases/register.usecase'
import { UpdateUserUseCase } from '../../../../core/users/application/use-cases/update.usecase'
import type { UserRepository } from '../../../../core/users/domain/repositories/user.repository'
import type { LoginUserPayload } from '../../../../core/users/domain/payloads/login-user.payload'
import type { RegisterUserPayload } from '../../../../core/users/domain/payloads/register-user.payload'
import type { UpdateUserPayload } from '../../../../core/users/domain/payloads/update-user.payload'

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

  async findById(req: FastifyRequest<{ Params: IdParams }>, res: FastifyReply): Promise<void> {
    const { id } = req.params

    const useCase = new FindByIdUseCase(this.repository)
    const user = await useCase.execute(id)

    res.status(200).send({ data: user })
  }

  async findByEmail(req: FastifyRequest<{ Querystring: { email: string } }>, res: FastifyReply): Promise<void> {
    const { email } = req.query

    const useCase = new FindByEmailUseCase(this.repository)
    const user = await useCase.execute(email)

    res.status(200).send({ data: user })
  }

  async register(req: FastifyRequest<{ Body: RegisterUserPayload }>, res: FastifyReply): Promise<void> {
    const payload = req.body

    const useCase = new RegisterUserUseCase(this.repository)
    const user = await useCase.execute(payload)

    res.status(201).send({ data: { id: user.id } })
  }

  async login(req: FastifyRequest<{ Body: LoginUserPayload }>, res: FastifyReply): Promise<void> {
    const payload = req.body

    const useCase = new LoginUserUseCase(this.repository)
    const user = await useCase.execute(payload)

    res.status(200).send({ data: { id: user.id, email: user.email } })
  }

  async update(req: FastifyRequest<{ Params: IdParams; Body: UpdateUserPayload }>, res: FastifyReply): Promise<void> {
    const { id } = req.params
    const payload = req.body

    const useCase = new UpdateUserUseCase(this.repository)
    await useCase.execute(id, payload)

    res.status(200).send({ data: { id } })
  }

  async delete(req: FastifyRequest<{ Params: IdParams }>, res: FastifyReply): Promise<void> {
    const { id } = req.params

    const useCase = new DeleteUserUseCase(this.repository)
    await useCase.execute(id)

    res.status(200).send({ data: { id } })
  }
}
