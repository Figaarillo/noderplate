import type UserEntity from '@user/domain/entities/user.entity'
import UserNotFoundException from '@user/domain/exceptions/user-not-found.exception'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'

class GetUserByID {
  constructor(private readonly repository: IUserRepository) {
    this.repository = repository
  }

  async exec(id: string): Promise<UserEntity> {
    const userFound = await this.repository.getBy({ id })
    if (userFound == null) {
      throw new UserNotFoundException()
    }

    return userFound
  }
}

export default GetUserByID
