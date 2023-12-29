import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'
import UserNotFoundException from '../exceptions/user-not-found.exception'
import UserFactory from '../factories/user.factory'
import type IUserEntity from '../interfaces/user-entity.interface'
import type IUserPrimitiveData from '../interfaces/user-primitive-data.interface'

class UserService {
  private readonly repository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.repository = userRepository
  }

  async register(payload: IUserPrimitiveData): Promise<IUserEntity> {
    const userCreated = UserFactory.create(payload)

    this.repository.save(userCreated)

    return userCreated
  }

  async deleteOne(id: string): Promise<IUserEntity> {
    const userDeleted = await this.repository.delete(id)
    if (userDeleted == null) {
      throw new UserNotFoundException()
    }

    return userDeleted
  }

  async getOneById(id: string): Promise<IUserEntity> {
    const userFound = await this.repository.getBy({ id })
    if (userFound == null) {
      throw new UserNotFoundException()
    }

    return userFound
  }

  async getOneByProperty(property: Record<string, any>): Promise<IUserEntity> {
    const userFound = await this.repository.getBy({ property })
    if (userFound == null) {
      throw new UserNotFoundException()
    }

    return userFound
  }

  async update(id: string, payload: Partial<IUserPrimitiveData>): Promise<IUserEntity> {
    const userFound = await this.getOneById(id)

    userFound.update(payload)
    //  TODO: validate that operation was successful

    this.repository.save(userFound)

    return userFound
  }
}

export default UserService
