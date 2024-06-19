import type UserEntity from '@user/domain/entities/user.entity'
import ErrorUserNotFound from '@user/domain/exceptions/user-not-found.exception'
import type UserRepository from '@user/domain/repository/user.repository'

class GetAllUserUseCase {
  constructor(private readonly repository: UserRepository) {
    this.repository = repository
  }

  async exec(offset: number, limit: number): Promise<UserEntity[]> {
    const usersFounded = await this.repository.getAll(offset, limit)
    if (usersFounded == null) {
      throw new ErrorUserNotFound('Cannot find any user when get all users')
    }

    if (usersFounded.length === 0) {
      throw new ErrorUserNotFound('Cannot find any user when get all users')
    }

    return usersFounded
  }
}

export default GetAllUserUseCase
