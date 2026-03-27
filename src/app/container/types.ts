import type { EntityManager, MikroORM } from '@mikro-orm/core'
import type { UserRepository } from '../../core/users/domain/repositories/user.repository'
import type { UserController } from '../../interfaces/http/fastify/users/controllers/user.controller'
import type { HashProvider } from '../../core/shared/application/hash.provider'
import type { TokenProvider } from '../../core/shared/application/token.provider'

export interface AppContainer {
  orm: MikroORM | null
  em: EntityManager | null
  repositories: {
    userRepository: UserRepository
  }
  providers: {
    hashProvider: HashProvider
    tokenProvider: TokenProvider
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
    providers: null as unknown as { hashProvider: HashProvider; tokenProvider: TokenProvider },
    controllers: null as unknown as { userController: UserController }
  }
}
