import { Module } from '@nestjs/common'
import { UsersModule } from './users/modules/users.module'
import { AuthModule } from './auth/modules/auth.module'
import { HealthController } from './health.controller'

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [HealthController]
})
export class AppModule {}
