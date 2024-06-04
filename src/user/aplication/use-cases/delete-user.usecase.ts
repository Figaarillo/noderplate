import UserNotFoundException from '@user/domain/exceptions/user-not-found.exception'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'

class DeleteUser {
  constructor(private readonly repository: IUserRepository) {
    this.repository = repository
  }

  async exec(id: string): Promise<void> {
    const userDeleted = await this.repository.delete(id)
    if (userDeleted == null) {
      throw new UserNotFoundException()
    }

    return userDeleted
  }
}

export default DeleteUser
