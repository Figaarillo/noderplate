import type { FastifyReply, FastifyRequest } from 'fastify'
import type { ListUsersUseCase } from '../../../../../core/users/application/use-cases/list.usecase'
import type { FindByIdUseCase } from '../../../../../core/users/application/use-cases/find-by-id.usecase'
import type { FindByEmailUseCase } from '../../../../../core/users/application/use-cases/find-by-email.usecase'
import type { RegisterUserUseCase } from '../../../../../core/users/application/use-cases/register.usecase'
import type { VerifyEmailUseCase } from '../../../../../core/users/application/use-cases/verify-email.usecase'
import type { LoginUserUseCase } from '../../../../../core/users/application/use-cases/login.usecase'
import type { RefreshTokenUseCase } from '../../../../../core/users/application/use-cases/refresh-token.usecase'
import type { ChangePasswordUseCase } from '../../../../../core/users/application/use-cases/change-password.usecase'
import type { UpdateUserUseCase } from '../../../../../core/users/application/use-cases/update.usecase'
import type { DeleteUserUseCase } from '../../../../../core/users/application/use-cases/delete.usecase'
import type { RegisterUserPayload } from '../../../../../core/users/domain/types/payloads/register-user.payload'
import type { LoginUserPayload } from '../../../../../core/users/domain/types/payloads/login-user.payload'
import type { UpdateUserPayload } from '../../../../../core/users/domain/types/payloads/update-user.payload'
import type { ChangePasswordPayload } from '../../../../../core/users/domain/types/payloads/change-password.payload'

export interface PaginationQuery {
  offset?: string
  limit?: string
}

export interface IdParams {
  id: string
}

export interface VerifyEmailBody {
  email: string
  code: string
}

export interface UserControllerDeps {
  listUsers: ListUsersUseCase
  findById: FindByIdUseCase
  findByEmail: FindByEmailUseCase
  registerUser: RegisterUserUseCase
  verifyEmail: VerifyEmailUseCase
  loginUser: LoginUserUseCase
  refreshToken: RefreshTokenUseCase
  changePassword: ChangePasswordUseCase
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

  async register(
    req: FastifyRequest<{ Body: RegisterUserPayload & { redirectUrl?: string } }>,
    res: FastifyReply
  ): Promise<{ id: string; message: string; verificationUrl: string }> {
    const { redirectUrl, ...payload } = req.body

    const result = await this.deps.registerUser.execute(payload, redirectUrl)

    res.status(201).send({
      data: {
        id: result.user.id,
        message: 'Usuario registrado. Por favor verifica tu email.',
        verificationUrl: result.verificationUrl
      }
    })
    return {
      id: result.user.id,
      message: 'Usuario registrado. Por favor verifica tu email.',
      verificationUrl: result.verificationUrl
    }
  }

  async verifyEmail(req: FastifyRequest<{ Body: VerifyEmailBody }>, res: FastifyReply): Promise<void> {
    const { email, code } = req.body

    const result = await this.deps.verifyEmail.execute(email, code)

    res.status(200).send({ data: result })
  }

  async login(
    req: FastifyRequest<{ Body: LoginUserPayload }>,
    res: FastifyReply
  ): Promise<{ id: string; tokens: { accessToken: string; refreshToken: string } }> {
    const payload = req.body

    const result = await this.deps.loginUser.execute(payload)

    res.status(200).send({ data: { id: result.user.id, tokens: result.tokens } })
    return { id: result.user.id, tokens: result.tokens }
  }

  async refreshToken(
    req: FastifyRequest<{ Body: { refreshToken: string } }>,
    res: FastifyReply
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = req.body

    const tokens = await this.deps.refreshToken.execute(refreshToken)

    res.status(200).send({ data: tokens })
    return tokens
  }

  async changePassword(req: FastifyRequest<{ Body: ChangePasswordPayload }>, res: FastifyReply): Promise<void> {
    const payload = req.body

    await this.deps.changePassword.execute(payload)

    res.status(200).send({ data: { message: 'Password changed successfully' } })
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
