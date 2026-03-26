import { Module } from '@nestjs/common'
import { RegisterUserUseCase } from '../../../../../core/users/application/use-cases/register.usecase'
import { ListUsersUseCase } from '../../../../../core/users/application/use-cases/list.usecase'
import { FindByIdUseCase } from '../../../../../core/users/application/use-cases/find-by-id.usecase'
import { FindByEmailUseCase } from '../../../../../core/users/application/use-cases/find-by-email.usecase'
import { UpdateUserUseCase } from '../../../../../core/users/application/use-cases/update.usecase'
import { DeleteUserUseCase } from '../../../../../core/users/application/use-cases/delete.usecase'
import type { UserRepository } from '../../../../../core/users/domain/repositories/user.repository'
import { PrismaUserRepository } from '../../../../../infrastructure/persistence/prisma/users/repositories/user.repository'
import { UsersController } from '../controllers/users.controller'

const USER_REPOSITORY = 'USER_REPOSITORY'
const LIST_USERS_USE_CASE = 'LIST_USERS_USE_CASE'
const FIND_BY_ID_USE_CASE = 'FIND_BY_ID_USE_CASE'
const FIND_BY_EMAIL_USE_CASE = 'FIND_BY_EMAIL_USE_CASE'
const REGISTER_USER_USE_CASE = 'REGISTER_USER_USE_CASE'
const UPDATE_USER_USE_CASE = 'UPDATE_USER_USE_CASE'
const DELETE_USER_USE_CASE = 'DELETE_USER_USE_CASE'

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useFactory: (): UserRepository => new PrismaUserRepository()
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
