import type { AppContainer } from './types'
import { UserController } from '../../interfaces/http/fastify/controllers/user.controller'
import { RegisterUserUseCase } from '../../core/users/application/use-cases/register.usecase'
import { ListUsersUseCase } from '../../core/users/application/use-cases/list.usecase'
import { FindByIdUseCase } from '../../core/users/application/use-cases/find-by-id.usecase'
import { FindByEmailUseCase } from '../../core/users/application/use-cases/find-by-email.usecase'
import { UpdateUserUseCase } from '../../core/users/application/use-cases/update.usecase'
import { DeleteUserUseCase } from '../../core/users/application/use-cases/delete.usecase'

export function registerUsers(container: AppContainer): void {
  const userRepository = container.repositories.userRepository

  const registerUser = new RegisterUserUseCase(userRepository)
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
    updateUser,
    deleteUser
  })

  container.controllers = {
    userController: controller
  }
}
