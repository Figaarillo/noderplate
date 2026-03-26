import { Module } from '@nestjs/common'
import { UsersModule } from './users/modules/users.module'
import { HealthController } from './health.controller'

@Module({
  imports: [UsersModule],
  controllers: [HealthController]
})
export class AppModule {}
