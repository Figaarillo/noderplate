import 'module-alias/register'
import TypeormConfig from '@shared/config/typeorm.config'
import BootstrapUser from '@user/user.bootstrap'
import * as dotenv from 'dotenv'

// Main
;(async () => {
  dotenv.config()

  const dbConfig = new TypeormConfig()
  const db = await dbConfig.initDBConnection()

  BootstrapUser(db)
})()
