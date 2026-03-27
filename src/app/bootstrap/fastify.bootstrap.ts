import Fastify, { type FastifyInstance } from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import AdminJSFastify from '@adminjs/fastify'
import { buildContainer } from '../container/build-container'
import { registerUserRoutes } from '../../interfaces/http/fastify/users/routes/user.route'
import { registerAuth2FARoutes } from '../../interfaces/http/fastify/auth/routes/auth-2fa.route'
import { adminJsConfig } from '../../infrastructure/admin/admin.config'
import type { AppContainer } from '../container/types'

interface AppRuntime {
  start: () => Promise<void>
}

export async function createFastifyRuntime(): Promise<AppRuntime> {
  const container = await buildContainer()
  const app = await createFastifyApp(container)

  return {
    async start() {
      const port = Number(process.env.PORT ?? 8080)
      await app.listen({ host: '0.0.0.0', port })
      // eslint-disable-next-line no-console
      console.log(`Server is running! Go to http://localhost:${port}`)
      // eslint-disable-next-line no-console
      console.log(`Admin panel available at http://localhost:${port}/admin`)
    }
  }
}

export async function createFastifyApp(container: AppContainer): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true
  })

  await app.register(fastifyCookie)
  await app.register(fastifyMultipart)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  // AdminJS types are not compatible with Fastify types
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  await app.register(AdminJSFastify, {
    adminJs: adminJsConfig.adminJs,
    auth: adminJsConfig.auth,
    sessionSecret: adminJsConfig.sessionSecret
  })

  registerUserRoutes(app, container)
  registerAuth2FARoutes(app, container)

  app.get('/health', async () => {
    return { status: 'ok' }
  })

  return await app
}
