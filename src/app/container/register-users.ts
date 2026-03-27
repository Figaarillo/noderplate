import type { AppContainer } from './types'
import { UserController } from '../../interfaces/http/fastify/users/controllers/user.controller'
import { AuthController } from '../../interfaces/http/fastify/auth/controllers/auth.controller'
import { RegisterUserUseCase } from '../../core/users/application/use-cases/register.usecase'
import { ListUsersUseCase } from '../../core/users/application/use-cases/list.usecase'
import { FindByIdUseCase } from '../../core/users/application/use-cases/find-by-id.usecase'
import { FindByEmailUseCase } from '../../core/users/application/use-cases/find-by-email.usecase'
import { UpdateUserUseCase } from '../../core/users/application/use-cases/update.usecase'
import { DeleteUserUseCase } from '../../core/users/application/use-cases/delete.usecase'
import { LoginUserUseCase } from '../../core/users/application/use-cases/login.usecase'
import { RefreshTokenUseCase } from '../../core/users/application/use-cases/refresh-token.usecase'
import { ChangePasswordUseCase } from '../../core/users/application/use-cases/change-password.usecase'
import { AuthService } from '../../core/auth/application/services/auth.service'
import { RequestTwoFactorCodeUseCase } from '../../core/auth/application/use-cases/request-two-factor-code.usecase'
import { VerifyTwoFactorCodeUseCase } from '../../core/auth/application/use-cases/verify-two-factor-code.usecase'

export function registerUsers(container: AppContainer): void {
  const userRepo = container.repositories.userRepository
  const verificationCodeRepo = container.repositories.verificationCodeRepository
  const hashProvider = container.providers.hashProvider
  const tokenProvider = container.providers.tokenProvider
  const emailProvider = container.providers.emailProvider
  const authService = new AuthService(tokenProvider)

  const registerUser = new RegisterUserUseCase(userRepo, hashProvider, authService)
  const loginUser = new LoginUserUseCase(userRepo, hashProvider, authService)
  const refreshToken = new RefreshTokenUseCase(userRepo, authService)
  const changePassword = new ChangePasswordUseCase(userRepo, hashProvider)
  const listUsers = new ListUsersUseCase(userRepo)
  const findById = new FindByIdUseCase(userRepo)
  const findByEmail = new FindByEmailUseCase(userRepo)
  const updateUser = new UpdateUserUseCase(userRepo)
  const deleteUser = new DeleteUserUseCase(userRepo)

  const userController = new UserController({
    listUsers,
    findById,
    findByEmail,
    registerUser,
    loginUser,
    refreshToken,
    changePassword,
    updateUser,
    deleteUser
  })

  const requestTwoFactorCode = new RequestTwoFactorCodeUseCase({
    verificationCodeRepository: verificationCodeRepo,
    emailProvider
  })

  const verifyTwoFactorCode = new VerifyTwoFactorCodeUseCase({
    verificationCodeRepository: verificationCodeRepo
  })

  const authController = new AuthController({
    requestTwoFactorCode,
    verifyTwoFactorCode,
    userRepository: userRepo,
    hashProvider,
    authService
  })

  container.controllers = {
    userController,
    authController
  }
}
