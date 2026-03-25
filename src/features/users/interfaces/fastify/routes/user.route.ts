import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { AppContainer } from '../../../../../app/container/types'
import type { PaginationQuery, IdParams } from '../controllers/user.controller'
import type { RegisterUserPayload } from '../../../domain/payloads/register-user.payload'
import type { UpdateUserPayload } from '../../../domain/payloads/update-user.payload'
import { RegisterUserDTO, UpdateUserDTO, CheckIdDTO } from '../dtos/user.dto'
import { SchemaValidator } from '../middlewares/zod-schema-validator.middleware'

export function registerUserRoutes(app: FastifyInstance, container: AppContainer): void {
  const controller = container.controllers.userController

  app.get('/api/users', async (req: FastifyRequest, res: FastifyReply) => {
    await controller.list(req as FastifyRequest<{ Querystring: PaginationQuery }>, res)
  })

  app.get('/api/users/:id', async (req: FastifyRequest, res: FastifyReply) => {
    new SchemaValidator(CheckIdDTO, req.params).validate()
    await controller.findById(req as FastifyRequest<{ Params: IdParams }>, res)
  })

  app.get('/api/users/email', async (req: FastifyRequest, res: FastifyReply) => {
    await controller.findByEmail(req as FastifyRequest<{ Querystring: { email: string } }>, res)
  })

  app.post('/api/users', async (req: FastifyRequest, res: FastifyReply) => {
    new SchemaValidator(RegisterUserDTO, req.body).validate()
    await controller.register(req as FastifyRequest<{ Body: RegisterUserPayload }>, res)
  })

  // Login route will be added when auth module is implemented
  // app.post('/api/users/auth/login', async (req: FastifyRequest, res: FastifyReply) => {
  //   new SchemaValidator(LoginUserDTO, req.body).validate()
  //   await controller.login(req as FastifyRequest<{ Body: LoginUserPayload }>, res)
  // })

  app.put('/api/users/:id', async (req: FastifyRequest, res: FastifyReply) => {
    new SchemaValidator(CheckIdDTO, req.params).validate()
    new SchemaValidator(UpdateUserDTO, req.body).validate()
    await controller.update(req as FastifyRequest<{ Params: IdParams; Body: UpdateUserPayload }>, res)
  })

  app.delete('/api/users/:id', async (req: FastifyRequest, res: FastifyReply) => {
    new SchemaValidator(CheckIdDTO, req.params).validate()
    await controller.delete(req as FastifyRequest<{ Params: IdParams }>, res)
  })
}
