import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from '../../interfaces/http/nest/app.module'
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

  const config = new DocumentBuilder()
    .setTitle('Noderplate API')
    .setDescription('Noderplate - Modular Node.js API with hexagonal architecture')
    .setVersion('1.0.0')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('2FA', 'Two-Factor Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      'bearerAuth'
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      deepLinking: false
    }
  })

  return {
    async start() {
      const port = env.port || 8080
      await app.listen(port)
      // eslint-disable-next-line no-console
      console.log(`Server is running! Go to http://localhost:${port}`)
      // eslint-disable-next-line no-console
      console.log(`Swagger UI available at http://localhost:${port}/api-docs`)
      // eslint-disable-next-line no-console
      console.log(`OpenAPI spec available at http://localhost:${port}/api-docs-json`)
    }
  }
}
