import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from '../../features/users/interfaces/nest/module/app.module'
import { env } from '../config/env'

interface AppRuntime {
  start: () => Promise<void>
}

export async function createNestRuntime(): Promise<AppRuntime> {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  return {
    async start() {
      await app.listen(env.port)
      // eslint-disable-next-line no-console
      console.log(`Server listening at http://0.0.0.0:${env.port}`)
      // eslint-disable-next-line no-console
      console.log('Server is running! Go to http://localhost:' + env.port)
    }
  }
}
