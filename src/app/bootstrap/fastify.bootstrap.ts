import Fastify from 'fastify'
import type { FastifyInstance } from 'fastify'
import { registerUserRoutes } from '../../interfaces/http/fastify/routes/user.route'
import type { UserRepository } from '../../core/users/domain/repositories/user.repository'

export async function createFastifyApp(repository: UserRepository): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: true
  })

  registerUserRoutes(fastify, repository)

  fastify.get('/health', async () => {
    return { status: 'ok' }
  })

  return await fastify
}

export async function startFastifyApp(fastify: FastifyInstance): Promise<void> {
  const port = Number(process.env.PORT ?? 5000)
  await fastify.listen({ host: '0.0.0.0', port })
  // eslint-disable-next-line no-console
  console.log(`Server is running! Go to http://localhost:${port}`)
}
