/* eslint-disable no-console */
import 'module-alias/register' // Must import this module first
import * as dotenv from 'dotenv'
import FastifyConifg from '@shared/config/fastify.config'
import TypeormConfig from '@shared/config/typeorm.config'
import BootstrapUser from '@user/user.bootstrap'

dotenv.config()
const PORT = Number(process.env.PORT)

/* Main */
;(async () => {
  const dbConfig = new TypeormConfig()
  const db = await dbConfig.initDBConnection()

  const fastify = new FastifyConifg().fastify

  BootstrapUser(db, fastify)

  fastify.get('/', async () => {
    return 'Hello, World!'
  })

  try {
    await fastify.listen({ port: PORT })
    console.log(`Server is running!🔥 Go to http://localhost:${PORT}`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
