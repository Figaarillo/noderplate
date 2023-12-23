import type Nullable from '@shared/domain/types/nullable.type'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'
import UserFactory from '../factories/user.factory'
import type IUserEntity from '../interfaces/user-entity.interface'
import type UserPayload from '../payloads/user.payload'

class UserService {
  private readonly repository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.repository = userRepository
  }

  async register(payload: UserPayload): Promise<IUserEntity> {
    const userCreated = UserFactory.create(payload)

    this.repository.save(userCreated)

    return userCreated
  }

  async deleteOne(id: string): Promise<void> {
    // TODO: validate that id is an uuid

    this.repository.delete(id)
  }

  async getOneById(id: string): Promise<Nullable<IUserEntity>> {
    // TODO: validate that id is an uuid

    return await this.repository.getBy({ id })
  }

  async getOneByProperty(property: Record<string, any>): Promise<Nullable<IUserEntity>> {
    // TODO: validate that property is a valid property of IUserEntity

    return await this.repository.getBy({ property })
  }

  async update(id: string, payload: Partial<UserPayload>): Promise<IUserEntity> {
    // TODO: validate that id is an uuid

    const userFound = await this.getOneById(id)

    if (userFound == null) {
      throw new Error('User not found')
    }

    userFound.update(payload)
    //  TODO: validate that operation was successful

    this.repository.save(userFound)

    return userFound
  }
}

export default UserService
