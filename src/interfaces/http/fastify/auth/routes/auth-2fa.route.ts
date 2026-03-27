import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { AppContainer } from '../../../../../app/container/types'
import {
  verificationPageHtml,
  passwordResetPageHtml,
  passwordResetEmailTemplate
} from '../../../../../infrastructure/templates/verification-code.email.template'
import { RequestPasswordResetUseCase } from '../../../../../core/auth/application/use-cases/request-password-reset.usecase'
import { ResetPasswordUseCase } from '../../../../../core/auth/application/use-cases/reset-password.usecase'

export function registerAuth2FARoutes(app: FastifyInstance, container: AppContainer): void {
  const authController = container.controllers.authController

  app.get(
    '/auth/verify',
    async (req: FastifyRequest<{ Querystring: { token: string; type: string } }>, res: FastifyReply) => {
      const { token, type } = req.query

      if (!token || !type) {
        res.status(400).send('Missing token or type parameter')
        return
      }

      const html = verificationPageHtml(token, type)
      res.header('Content-Type', 'text/html').status(200).send(html)
    }
  )

  app.post(
    '/api/auth/verify-2fa',
    async (req: FastifyRequest<{ Body: { token: string; code: string; type: string } }>, res: FastifyReply) => {
      const { token, code, type } = req.body

      try {
        const result = await authController.verifyTwoFactorCode(token, code, type)
        res.status(200).send(result)
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Verification failed'
        res.status(400).send({ error: message })
      }
    }
  )

  app.post(
    '/api/auth/resend-2fa',
    async (req: FastifyRequest<{ Body: { token: string; type: string } }>, res: FastifyReply) => {
      const { token, type } = req.body

      try {
        await authController.resendTwoFactorCode(token, type)
        res.status(200).send({ message: 'Code resent successfully' })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to resend code'
        res.status(400).send({ error: message })
      }
    }
  )

  app.get(
    '/auth/reset-password',
    async (req: FastifyRequest<{ Querystring: { token: string } }>, res: FastifyReply) => {
      const { token } = req.query

      if (!token) {
        res.status(400).send('Missing token parameter')
        return
      }

      const html = passwordResetPageHtml(token)
      res.header('Content-Type', 'text/html').status(200).send(html)
    }
  )

  app.post('/api/auth/forgot-password', async (req: FastifyRequest<{ Body: { email: string } }>, res: FastifyReply) => {
    const { email } = req.body

    if (!email) {
      res.status(400).send({ error: 'Email is required' })
      return
    }

    const requestPasswordReset = new RequestPasswordResetUseCase({
      userRepository: container.repositories.userRepository,
      verificationCodeRepository: container.repositories.verificationCodeRepository,
      emailProvider: container.providers.emailProvider
    })

    await requestPasswordReset.execute(email, passwordResetEmailTemplate)

    res.status(200).send({ message: 'If the email exists, a verification code has been sent' })
  })

  app.post(
    '/api/auth/reset-password',
    async (req: FastifyRequest<{ Body: { token: string; code: string; newPassword: string } }>, res: FastifyReply) => {
      const { token, code, newPassword } = req.body

      if (!token || !code || !newPassword) {
        res.status(400).send({ error: 'Token, code, and new password are required' })
        return
      }

      const tokenPayload = container.providers.tokenProvider.verifyAccessToken(token)
      if (!tokenPayload?.sub) {
        res.status(400).send({ error: 'Invalid or expired token' })
        return
      }

      const email = tokenPayload.email as string

      const resetPassword = new ResetPasswordUseCase({
        userRepository: container.repositories.userRepository,
        verificationCodeRepository: container.repositories.verificationCodeRepository,
        hashProvider: container.providers.hashProvider
      })

      try {
        await resetPassword.execute(email, code, newPassword)
        res.status(200).send({ message: 'Password reset successfully' })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Password reset failed'
        res.status(400).send({ error: message })
      }
    }
  )
}
