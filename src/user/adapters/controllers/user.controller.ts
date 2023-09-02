import type IUserRepository from '@user/infrastructure/interfaces/user.repository.interface'
import { UserInMemoryRepository } from '@user/infrastructure/repositories/user-in-memory.repository'

class UserController {
  userRepository: IUserRepository

  constructor() {
    this.userRepository = new UserInMemoryRepository()
  }

  createUser(): void {
    // DTO
    // crear Use case
    // retornar resultado de ejecutar el usercase
  }

  deleteUser(): void {}
  getUser(): void {}
  updateUser(): void {}
}

export default UserController
