import Fastify, { type FastifyInstance } from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { buildContainer } from '../container/build-container'
import { registerUserRoutes } from '../../interfaces/http/fastify/users/routes/user.route'
import { registerAuth2FARoutes } from '../../interfaces/http/fastify/auth/routes/auth-2fa.route'
import { registerAuthSwaggerRoutes } from '../../interfaces/http/fastify/swagger/auth-swagger.route'
import { swaggerConfig } from '../../infrastructure/swagger/swagger.config'
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
      console.log(`Swagger UI available at http://localhost:${port}/api-docs`)
    }
  }
}

export async function createFastifyApp(container: AppContainer): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true
  })

  await app.register(fastifyCookie)
  await app.register(fastifyMultipart)

  await app.register(fastifySwagger, {
    openapi: swaggerConfig,
    mode: 'dynamic'
  })

  await app.register(fastifySwaggerUi, {
    routePrefix: '/api-docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  })

  registerUserRoutes(app, container)
  registerAuth2FARoutes(app, container)
  registerAuthSwaggerRoutes(app)

  app.get('/health', async () => {
    return { status: 'ok' }
  })

  return await app
}
