import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { UsersModule } from './users/modules/users.module'
import { AuthModule } from './auth/modules/auth.module'
import { HealthController } from './health.controller'

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
    UsersModule,
    AuthModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
