import type UserEntity from '@user/domain/entities/user.entity'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'

class GetUserByProperty {
  constructor(private readonly repository: IUserRepository) {
    this.repository = repository
  }

  async exec(property: Record<string, any>): Promise<UserEntity> {
    const userFound = await this.repository.getBy({ property })
    if (userFound == null) {
      throw new UserNotFoundException()
    }

    return userFound
  }
}

export default GetUserByProperty
