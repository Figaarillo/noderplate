import type UserEntity from '@user/domain/entities/user.entity'
import UserNotFoundException from '@user/domain/exceptions/user-not-found.exception'
import type UserRepository from '@user/domain/repository/user.repository'

class GetUserByID {
  constructor(private readonly repository: UserRepository) {
    this.repository = repository
  }

  async exec(id: string): Promise<UserEntity> {
    const userFound = await this.repository.getByID(id)
    if (userFound == null) {
      throw new UserNotFoundException()
    }

    return userFound
  }
}

export default GetUserByID
