import { MikroORM } from '@mikro-orm/core'
import mikroORMConfig from '../../app/config/mikro-orm.config'
import { MikroORMUserRepository } from '../../infrastructure/persistence/mikro-orm/users/repositories/user.repository'
import { PrismaUserRepository } from '../../infrastructure/persistence/prisma/users/repositories/user.repository'
import { InMemoryVerificationCodeRepository } from '../../infrastructure/persistence/in-memory/verification-code.repository'
import { BcryptHashProvider } from '../../infrastructure/security/bcrypt-hash.provider'
import { JwtTokenProvider } from '../../infrastructure/security/jwt-token.provider'
import { NodemailerEmailProvider } from '../../infrastructure/email/nodemailer.provider'
import type { AppContainer } from './types'

export async function registerInfrastructure(container: AppContainer): Promise<void> {
  const ormType = process.env.ORM ?? 'mikroorm'

  container.providers = {
    hashProvider: new BcryptHashProvider(),
    tokenProvider: new JwtTokenProvider(),
    emailProvider: new NodemailerEmailProvider()
  }

  container.repositories = {
    userRepository: ormType === 'prisma' ? new PrismaUserRepository() : (null as any),
    verificationCodeRepository: new InMemoryVerificationCodeRepository()
  }

  if (ormType === 'prisma') {
    return
  }

  const orm = await MikroORM.init(mikroORMConfig)
  const em = orm.em.fork()

  container.orm = orm
  container.em = em

  container.repositories.userRepository = new MikroORMUserRepository(em)
}
