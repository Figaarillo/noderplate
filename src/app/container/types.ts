import type { EntityManager, MikroORM } from '@mikro-orm/core'
import type { UserRepository } from '../../core/users/domain/repositories/user.repository'
import type { UserController } from '../../interfaces/http/fastify/users/controllers/user.controller'

export interface AppContainer {
  orm: MikroORM | null
  em: EntityManager | null
  repositories: {
    userRepository: UserRepository
  }
  controllers: {
    userController: UserController
  }
}

export function createContainer(): AppContainer {
  return {
    orm: null,
    em: null,
    repositories: null as unknown as { userRepository: UserRepository },
    controllers: null as unknown as { userController: UserController }
  }
}
