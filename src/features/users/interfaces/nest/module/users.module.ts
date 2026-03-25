import { Module } from '@nestjs/common'
import type { UserRepository } from '../../../domain/repositories/user.repository'
import { RegisterUserUseCase } from '../../../application/use-cases/register.usecase'
import { ListUsersUseCase } from '../../../application/use-cases/list.usecase'
import { FindByIdUseCase } from '../../../application/use-cases/find-by-id.usecase'
import { FindByEmailUseCase } from '../../../application/use-cases/find-by-email.usecase'
import { UpdateUserUseCase } from '../../../application/use-cases/update.usecase'
import { DeleteUserUseCase } from '../../../application/use-cases/delete.usecase'
import { PrismaUserRepository } from '../../../infrastructure/prisma/repositories/user.repository'
import { UsersController } from '../users.controller'
import {
  USER_REPOSITORY,
  LIST_USERS_USE_CASE,
  FIND_BY_ID_USE_CASE,
  FIND_BY_EMAIL_USE_CASE,
  REGISTER_USER_USE_CASE,
  UPDATE_USER_USE_CASE,
  DELETE_USER_USE_CASE
} from '../providers/users.providers'

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useFactory: (): UserRepository => {
        return new PrismaUserRepository()
      }
    },
    {
      provide: LIST_USERS_USE_CASE,
      useFactory: (userRepository: UserRepository) => new ListUsersUseCase(userRepository),
      inject: [USER_REPOSITORY]
    },
    {
      provide: FIND_BY_ID_USE_CASE,
      useFactory: (userRepository: UserRepository) => new FindByIdUseCase(userRepository),
      inject: [USER_REPOSITORY]
    },
    {
      provide: FIND_BY_EMAIL_USE_CASE,
      useFactory: (userRepository: UserRepository) => new FindByEmailUseCase(userRepository),
      inject: [USER_REPOSITORY]
    },
    {
      provide: REGISTER_USER_USE_CASE,
      useFactory: (userRepository: UserRepository) => new RegisterUserUseCase(userRepository),
      inject: [USER_REPOSITORY]
    },
    {
      provide: UPDATE_USER_USE_CASE,
      useFactory: (userRepository: UserRepository) => new UpdateUserUseCase(userRepository),
      inject: [USER_REPOSITORY]
    },
    {
      provide: DELETE_USER_USE_CASE,
      useFactory: (userRepository: UserRepository) => new DeleteUserUseCase(userRepository),
      inject: [USER_REPOSITORY]
    }
  ]
})
export class UsersModule {}
