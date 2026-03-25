import Fastify, { type FastifyInstance } from 'fastify'
import { buildContainer } from '../container/build-container'
import { registerUserRoutes } from '../../features/users/interfaces/fastify/routes/user.route'
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

  registerUserRoutes(app, container)

  app.get('/health', async () => {
    return { status: 'ok' }
  })

  return await app
}
