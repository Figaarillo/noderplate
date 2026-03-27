import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import type { AppContainer } from '../../../../../app/container/types'
import { verificationPageHtml } from '../../../../../infrastructure/templates/verification-code.email.template'

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
}
