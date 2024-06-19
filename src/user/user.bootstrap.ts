import { type DataSource } from 'typeorm'
import type UserRepository from './domain/repository/user.repository'
import UserInMemoryRepository from './infrastructure/repositories/in-memory/user.in-memory.repository'
import UserHandler from './infrastructure/handler/user.handler'
import { type FastifyInstance } from 'fastify'
import UserRoute from './infrastructure/routes/user.route'

function BootstrapUser(_db: DataSource, router: FastifyInstance): void {
  const repository: UserRepository = new UserInMemoryRepository()

  const handler = new UserHandler(repository)

  const userRoute = new UserRoute(router, handler)
  userRoute.setupRoutes()
}

export default BootstrapUser
