import { MikroORM } from '@mikro-orm/postgresql'
import mikroORMConfig from '../../../../features/users/infrastructure/mikro-orm/config/mikro-orm.config'

export default (async () => {
  const orm = await MikroORM.init({
    ...mikroORMConfig,
    migrations: {
      ...mikroORMConfig.migrations,
      allOrNothing: true,
      safe: true,
      emit: 'ts'
    }
  })

  const migrator = orm.getMigrator()

  await migrator.up()

  await orm.close(true)
})()
