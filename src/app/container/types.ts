import type { EntityManager, MikroORM } from '@mikro-orm/core'
import type { UserRepository } from '../../core/users/domain/repositories/user.repository'
import type { VerificationCodeRepository } from '../../core/auth/domain/repositories/verification-code.repository'
import type { UserController } from '../../interfaces/http/fastify/users/controllers/user.controller'
import type { AuthController } from '../../interfaces/http/fastify/auth/controllers/auth.controller'
import type { HashProvider } from '../../core/shared/application/hash.provider'
import type { TokenProvider } from '../../core/shared/application/token.provider'
import type { EmailProvider } from '../../core/shared/application/email.provider'

export interface AppContainer {
  orm: MikroORM | null
  em: EntityManager | null
  repositories: {
    userRepository: UserRepository
    verificationCodeRepository: VerificationCodeRepository
  }
  providers: {
    hashProvider: HashProvider
    tokenProvider: TokenProvider
    emailProvider: EmailProvider
  }
  controllers: {
    userController: UserController
    authController: AuthController
  }
}

export function createContainer(): AppContainer {
  return {
    orm: null,
    em: null,
    repositories: null as unknown as {
      userRepository: UserRepository
      verificationCodeRepository: VerificationCodeRepository
    },
    providers: null as unknown as {
      hashProvider: HashProvider
      tokenProvider: TokenProvider
      emailProvider: EmailProvider
    },
    controllers: null as unknown as { userController: UserController; authController: AuthController }
  }
}
