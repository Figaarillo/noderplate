import type UserEntity from '@user/domain/entities/user.entity'
import UserNotFoundException from '@user/domain/exceptions/user-not-found.exception'
import type UserRepository from '@user/domain/repository/user.repository'

class GetUserByProperty {
  constructor(private readonly repository: UserRepository) {
    this.repository = repository
  }

  async exec(name: string): Promise<UserEntity> {
    const userFound = await this.repository.getByName(name)
    if (userFound == null) {
      throw new UserNotFoundException()
    }

    return userFound
  }
}

export default GetUserByProperty
