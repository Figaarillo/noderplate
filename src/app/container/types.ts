import type { EntityManager, MikroORM } from '@mikro-orm/core'
import type { UserRepository } from '../../features/users/domain/repositories/user.repository'
import type { UserController } from '../../features/users/interfaces/fastify/controllers/user.controller'

export interface AppContainer {
  orm: MikroORM
  em: EntityManager
  repositories: {
    userRepository: UserRepository
  }
  controllers: {
    userController: UserController
  }
}

export function createContainer(): AppContainer {
  return {
    orm: null as unknown as MikroORM,
    em: null as unknown as EntityManager,
    repositories: null as unknown as { userRepository: UserRepository },
    controllers: null as unknown as { userController: UserController }
  }
}
