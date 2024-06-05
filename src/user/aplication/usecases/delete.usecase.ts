import ErrorUserNotFound from '@user/domain/exceptions/user-not-found.exception'
import type UserRepository from '@user/domain/repository/user.repository'

class DeleteUser {
  constructor(private readonly repository: UserRepository) {
    this.repository = repository
  }

  async exec(id: string): Promise<void> {
    const userDeleted = await this.repository.delete(id)
    if (userDeleted == null) {
      throw new ErrorUserNotFound(`Cannont find user with id: ${id} when delete user`)
    }
  }
}

export default DeleteUser
