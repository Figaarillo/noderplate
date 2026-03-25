import 'module-alias/register'
import { MikroORM } from '@mikro-orm/core'
import { mikroORMConfig } from './infrastructure/persistence/mikro-orm/config/mikro-orm.config'
import { MikroORMUserRepository } from './infrastructure/persistence/mikro-orm/repositories/user.repository'
import { createFastifyApp, startFastifyApp } from './app/bootstrap/fastify.bootstrap'

async function main(): Promise<void> {
  try {
    const orm = await MikroORM.init(mikroORMConfig)
    // eslint-disable-next-line no-console
    console.log('MikroORM connected! 🚀')

    const em = orm.em.fork()
    const userRepository = new MikroORMUserRepository(em)

    const fastify = await createFastifyApp(userRepository)
    await startFastifyApp(fastify)
  } catch (error) {
    console.error('Failed to start application:', error)
    process.exit(1)
  }
}

main()
