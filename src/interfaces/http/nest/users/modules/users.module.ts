import { Module } from '@nestjs/common'
import { RegisterUserUseCase } from '../../../../../core/users/application/use-cases/register.usecase'
import { ListUsersUseCase } from '../../../../../core/users/application/use-cases/list.usecase'
import { FindByIdUseCase } from '../../../../../core/users/application/use-cases/find-by-id.usecase'
import { FindByEmailUseCase } from '../../../../../core/users/application/use-cases/find-by-email.usecase'
import { UpdateUserUseCase } from '../../../../../core/users/application/use-cases/update.usecase'
import { DeleteUserUseCase } from '../../../../../core/users/application/use-cases/delete.usecase'
import { LoginUserUseCase } from '../../../../../core/users/application/use-cases/login.usecase'
import { RefreshTokenUseCase } from '../../../../../core/users/application/use-cases/refresh-token.usecase'
import { ChangePasswordUseCase } from '../../../../../core/users/application/use-cases/change-password.usecase'
import type { UserRepository } from '../../../../../core/users/domain/repositories/user.repository'
import type { HashProvider } from '../../../../../core/shared/application/hash.provider'
import type { TokenProvider } from '../../../../../core/shared/application/token.provider'
import { PrismaUserRepository } from '../../../../../infrastructure/persistence/prisma/users/repositories/user.repository'
import { BcryptHashProvider } from '../../../../../infrastructure/security/bcrypt-hash.provider'
import { JwtTokenProvider } from '../../../../../infrastructure/security/jwt-token.provider'
import { UsersController } from '../controllers/users.controller'

const USER_REPOSITORY = 'USER_REPOSITORY'
const HASH_PROVIDER = 'HASH_PROVIDER'
const TOKEN_PROVIDER = 'TOKEN_PROVIDER'
const LIST_USERS_USE_CASE = 'LIST_USERS_USE_CASE'
const FIND_BY_ID_USE_CASE = 'FIND_BY_ID_USE_CASE'
const FIND_BY_EMAIL_USE_CASE = 'FIND_BY_EMAIL_USE_CASE'
const REGISTER_USER_USE_CASE = 'REGISTER_USER_USE_CASE'
const LOGIN_USER_USE_CASE = 'LOGIN_USER_USE_CASE'
const REFRESH_TOKEN_USE_CASE = 'REFRESH_TOKEN_USE_CASE'
const CHANGE_PASSWORD_USE_CASE = 'CHANGE_PASSWORD_USE_CASE'
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
      provide: HASH_PROVIDER,
      useFactory: (): HashProvider => new BcryptHashProvider()
    },
    {
      provide: TOKEN_PROVIDER,
      useFactory: (): TokenProvider => new JwtTokenProvider()
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
      useFactory: (userRepository: UserRepository, hashProvider: HashProvider, tokenProvider: TokenProvider) =>
        new RegisterUserUseCase(userRepository, hashProvider, tokenProvider),
      inject: [USER_REPOSITORY, HASH_PROVIDER, TOKEN_PROVIDER]
    },
    {
      provide: LOGIN_USER_USE_CASE,
      useFactory: (userRepository: UserRepository, hashProvider: HashProvider, tokenProvider: TokenProvider) =>
        new LoginUserUseCase(userRepository, hashProvider, tokenProvider),
      inject: [USER_REPOSITORY, HASH_PROVIDER, TOKEN_PROVIDER]
    },
    {
      provide: REFRESH_TOKEN_USE_CASE,
      useFactory: (userRepository: UserRepository, tokenProvider: TokenProvider) =>
        new RefreshTokenUseCase(userRepository, tokenProvider),
      inject: [USER_REPOSITORY, TOKEN_PROVIDER]
    },
    {
      provide: CHANGE_PASSWORD_USE_CASE,
      useFactory: (userRepository: UserRepository, hashProvider: HashProvider) =>
        new ChangePasswordUseCase(userRepository, hashProvider),
      inject: [USER_REPOSITORY, HASH_PROVIDER]
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
