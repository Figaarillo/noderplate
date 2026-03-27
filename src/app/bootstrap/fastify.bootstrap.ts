import Fastify, { type FastifyInstance } from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { buildContainer } from '../container/build-container'
import { registerUserRoutes } from '../../interfaces/http/fastify/users/routes/user.route'
import { registerAuth2FARoutes } from '../../interfaces/http/fastify/auth/routes/auth-2fa.route'
import type { AppContainer } from '../container/types'

interface AppRuntime {
  start: () => Promise<void>
}

export async function createFastifyRuntime(): Promise<AppRuntime> {
  const container = await buildContainer()
  const app = await createFastifyApp(container)

  return {
    async start() {
      const port = Number(process.env.PORT ?? 5000)
      await app.listen({ host: '0.0.0.0', port })
      // eslint-disable-next-line no-console
      console.log(`Server is running! Go to http://localhost:${port}`)
    }
  }
}

export async function createFastifyApp(container: AppContainer): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true
  })

  await app.register(fastifyCookie)

  registerUserRoutes(app, container)
  registerAuth2FARoutes(app, container)

  app.get('/health', async () => {
    return { status: 'ok' }
  })

  return await app
}
