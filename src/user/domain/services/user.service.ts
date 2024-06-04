import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'
import UserNotFoundException from '../exceptions/user-not-found.exception'
import type UserEntity from '../entities/user.entity'

class UserService {
  constructor(private readonly repository: IUserRepository) {
    this.repository = repository
  }

  async getOneByProperty(property: Record<string, any>): Promise<UserEntity> {
    const userFound = await this.repository.getBy({ property })
    if (userFound == null) {
      throw new UserNotFoundException()
    }

    return userFound
  }

  async update(id: string, payload: Partial<UserPayload>): Promise<UserEntity> {
    const userFound = await this.getOneById(id)

    userFound.update(payload)
    //  TODO: validate that operation was successful

    this.repository.save(userFound)

    return userFound
  }
}

export default UserService
