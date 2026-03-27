import { Module } from '@nestjs/common'
import { AdminModule as AdminJsNestModule } from '@adminjs/nestjs'

@Module({
  imports: [AdminJsNestModule]
})
export class AdminModule {}
