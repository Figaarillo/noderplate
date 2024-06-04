import type UserEntity from '@user/domain/entities/user.entity'
import UserNotFoundException from '@user/domain/exceptions/user-not-found.exception'
import type UserRepository from '@user/domain/repository/user.repository'

class GetAllUser {
  constructor(private readonly repository: UserRepository) {
    this.repository = repository
  }

  async exec(): Promise<UserEntity[]> {
    const usersFounded = await this.repository.getAll()
    if (usersFounded.length === 0) {
      throw new UserNotFoundException()
    }

    return usersFounded
  }
}

export default GetAllUser
