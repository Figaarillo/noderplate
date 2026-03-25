import type { FastifyReply, FastifyRequest } from 'fastify'
import type { ListUsersUseCase } from '../../../../core/users/application/use-cases/list.usecase'
import type { FindByIdUseCase } from '../../../../core/users/application/use-cases/find-by-id.usecase'
import type { FindByEmailUseCase } from '../../../../core/users/application/use-cases/find-by-email.usecase'
import type { RegisterUserUseCase } from '../../../../core/users/application/use-cases/register.usecase'
import type { UpdateUserUseCase } from '../../../../core/users/application/use-cases/update.usecase'
import type { DeleteUserUseCase } from '../../../../core/users/application/use-cases/delete.usecase'
import type { RegisterUserPayload } from '../../../../core/users/domain/payloads/register-user.payload'
import type { UpdateUserPayload } from '../../../../core/users/domain/payloads/update-user.payload'

export interface PaginationQuery {
  offset?: string
  limit?: string
}

export interface IdParams {
  id: string
}

export interface UserControllerDeps {
  listUsers: ListUsersUseCase
  findById: FindByIdUseCase
  findByEmail: FindByEmailUseCase
  registerUser: RegisterUserUseCase
  updateUser: UpdateUserUseCase
  deleteUser: DeleteUserUseCase
}

export class UserController {
  constructor(private readonly deps: UserControllerDeps) {}

  async list(req: FastifyRequest<{ Querystring: PaginationQuery }>, res: FastifyReply): Promise<void> {
    const offset = parseInt(req.query.offset ?? '0')
    const limit = parseInt(req.query.limit ?? '10')

    const users = await this.deps.listUsers.execute(offset, limit)

    res.status(200).send({ data: users })
  }

  async findById(req: FastifyRequest<{ Params: IdParams }>, res: FastifyReply): Promise<void> {
    const { id } = req.params

    const user = await this.deps.findById.execute(id)

    res.status(200).send({ data: user })
  }

  async findByEmail(req: FastifyRequest<{ Querystring: { email: string } }>, res: FastifyReply): Promise<void> {
    const { email } = req.query

    const user = await this.deps.findByEmail.execute(email)

    res.status(200).send({ data: user })
  }

  async register(req: FastifyRequest<{ Body: RegisterUserPayload }>, res: FastifyReply): Promise<void> {
    const payload = req.body

    const user = await this.deps.registerUser.execute(payload)

    res.status(201).send({ data: { id: user.id } })
  }

  async update(req: FastifyRequest<{ Params: IdParams; Body: UpdateUserPayload }>, res: FastifyReply): Promise<void> {
    const { id } = req.params
    const payload = req.body

    await this.deps.updateUser.execute(id, payload)

    res.status(200).send({ data: { id } })
  }

  async delete(req: FastifyRequest<{ Params: IdParams }>, res: FastifyReply): Promise<void> {
    const { id } = req.params

    await this.deps.deleteUser.execute(id)

    res.status(200).send({ data: { id } })
  }
}
