import type { AppContainer } from './types'
import { UserController } from '../../interfaces/http/fastify/users/controllers/user.controller'
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

export function registerUsers(container: AppContainer): void {
  const userRepository = container.repositories.userRepository
  const { hashProvider, tokenProvider } = container.providers
  const authService = new AuthService(tokenProvider)

  const registerUser = new RegisterUserUseCase(userRepository, hashProvider, authService)
  const loginUser = new LoginUserUseCase(userRepository, hashProvider, authService)
  const refreshToken = new RefreshTokenUseCase(userRepository, authService)
  const changePassword = new ChangePasswordUseCase(userRepository, hashProvider)
  const listUsers = new ListUsersUseCase(userRepository)
  const findById = new FindByIdUseCase(userRepository)
  const findByEmail = new FindByEmailUseCase(userRepository)
  const updateUser = new UpdateUserUseCase(userRepository)
  const deleteUser = new DeleteUserUseCase(userRepository)

  const controller = new UserController({
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

  container.controllers = {
    userController: controller
  }
}
