import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { AppContainer } from '../../../../../app/container/types'
import type { PaginationQuery, IdParams, VerifyEmailBody } from '../controllers/user.controller'
import type { RegisterUserPayload } from '../../../../../core/users/domain/types/payloads/register-user.payload'
import type { LoginUserPayload } from '../../../../../core/users/domain/types/payloads/login-user.payload'
import type { UpdateUserPayload } from '../../../../../core/users/domain/types/payloads/update-user.payload'
import type { ChangePasswordPayload } from '../../../../../core/users/domain/types/payloads/change-password.payload'
import {
  RegisterUserDTO,
  UpdateUserDTO,
  CheckIdDTO,
  LoginUserDTO,
  ChangePasswordDTO,
  VerifyEmailDTO
} from '../schemas/user.dto'
import { SchemaValidator } from '../zod-schema-validator.middleware'
import { verifyEmailPageHtml } from './verify-email-page.route'

const ACCESS_TOKEN_COOKIE_NAME = 'accessToken'
const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'
const COOKIE_MAX_AGE_ACCESS = 60 * 60 * 1000
const COOKIE_MAX_AGE_REFRESH = 7 * 24 * 60 * 60 * 1000

function setAuthCookies(res: FastifyReply, accessToken: string, refreshToken: string): void {
  res.setCookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE_ACCESS
  })

  res.setCookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE_REFRESH
  })
}

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

  app.post('/api/users/verify', async (req: FastifyRequest, res: FastifyReply) => {
    new SchemaValidator(VerifyEmailDTO, req.body).validate()
    await controller.verifyEmail(req as FastifyRequest<{ Body: VerifyEmailBody }>, res)
  })

  app.get('/verify-email', async (req: FastifyRequest, res: FastifyReply) => {
    const { email } = req.query as { email?: string }
    if (!email) {
      res.status(400).send('Missing email')
      return
    }
    const html = verifyEmailPageHtml(email)
    res.status(200).header('Content-Type', 'text/html').send(html)
  })

  app.post('/api/users/auth/login', async (req: FastifyRequest, res: FastifyReply) => {
    new SchemaValidator(LoginUserDTO, req.body).validate()
    const result = await controller.login(req as FastifyRequest<{ Body: LoginUserPayload }>, res)
    if (result?.tokens) {
      setAuthCookies(res, result.tokens.accessToken, result.tokens.refreshToken)
    }
  })

  app.post('/api/users/auth/refresh', async (req: FastifyRequest, res: FastifyReply) => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME]
    if (!refreshToken) {
      res.status(401).send({ error: 'Refresh token not found' })
      return
    }
    const result = await controller.refreshToken(req as FastifyRequest<{ Body: { refreshToken: string } }>, res)
    if (result?.accessToken) {
      res.setCookie(ACCESS_TOKEN_COOKIE_NAME, result.accessToken, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: COOKIE_MAX_AGE_ACCESS
      })
    }
  })

  app.post('/api/users/auth/change-password', async (req: FastifyRequest, res: FastifyReply) => {
    new SchemaValidator(ChangePasswordDTO, req.body).validate()
    await controller.changePassword(req as FastifyRequest<{ Body: ChangePasswordPayload }>, res)
  })

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
