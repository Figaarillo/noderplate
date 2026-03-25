import type { FastifyInstance } from 'fastify'
import { UserController, type PaginationQuery, type IdParams } from '../controllers/user.controller'
import type { UserRepository } from '@core/users/domain/repositories/user.repository'
import { RegisterUserDTO, LoginUserDTO, UpdateUserDTO, CheckIdDTO } from '../dtos/user.dto'
import { SchemaValidator } from '../middlewares/zod-schema-validator.middleware'
import type { RegisterUserPayload } from '@core/users/domain/payloads/register-user.payload'
import type { LoginUserPayload } from '@core/users/domain/payloads/login-user.payload'
import type { UpdateUserPayload } from '@core/users/domain/payloads/update-user.payload'

export function registerUserRoutes(fastify: FastifyInstance, repository: UserRepository): void {
  const controller = new UserController(repository)

  fastify.get<{ Querystring: PaginationQuery }>('/api/users', async (req, res) => {
    await controller.list(req, res)
  })

  fastify.get<{ Params: IdParams }>('/api/users/:id', async (req, res) => {
    const validator = new SchemaValidator(CheckIdDTO, req.params)
    validator.validate()
    await controller.findById(req, res)
  })

  fastify.get<{ Querystring: { email: string } }>('/api/users/email', async (req, res) => {
    await controller.findByEmail(req, res)
  })

  fastify.post<{ Body: RegisterUserPayload }>('/api/users', async (req, res) => {
    const validator = new SchemaValidator(RegisterUserDTO, req.body)
    validator.validate()
    await controller.register(req, res)
  })

  fastify.post<{ Body: LoginUserPayload }>('/api/users/auth/login', async (req, res) => {
    const validator = new SchemaValidator(LoginUserDTO, req.body)
    validator.validate()
    await controller.login(req, res)
  })

  fastify.put<{ Params: IdParams; Body: UpdateUserPayload }>('/api/users/:id', async (req, res) => {
    const idValidator = new SchemaValidator(CheckIdDTO, req.params)
    idValidator.validate()
    const bodyValidator = new SchemaValidator(UpdateUserDTO, req.body)
    bodyValidator.validate()
    await controller.update(req, res)
  })

  fastify.delete<{ Params: IdParams }>('/api/users/:id', async (req, res) => {
    const validator = new SchemaValidator(CheckIdDTO, req.params)
    validator.validate()
    await controller.delete(req, res)
  })
}
