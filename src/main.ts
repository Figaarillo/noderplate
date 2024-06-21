/* eslint-disable no-console */
import 'module-alias/register' // Must be import this module first
import * as dotenv from 'dotenv'
import FastifyConifg from '@shared/config/fastify.config'
import TypeormConfig from '@shared/config/typeorm.config'
import BootstrapUser from '@user/user.bootstrap'

dotenv.config()
const PORT = Number(process.env.PORT)

/* Main */
;(async () => {
  try {
    const dbConfig = new TypeormConfig()
    const db = await dbConfig.initDBConnection()
    console.log('')

    const fastifyConfig = new FastifyConifg()
    const fastify = await fastifyConfig.server

    BootstrapUser(db, fastify)

    fastify.get('/', async () => {
      return 'Hello, World!'
    })
    await fastifyConfig.start()
    console.log(`Server is running!🔥 Go to http://localhost:${PORT}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
