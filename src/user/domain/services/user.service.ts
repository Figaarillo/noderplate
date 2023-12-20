import type IUserRepository from 'src/user/infrastructure/repositories/interfaces/user.repository.interface'
import UserFactory from '../factories/user.factory'
import type IUserEntity from '../interfaces/user.entity.interface'
import type UserPayload from '../payloads/user.payload'
import type Nullable from 'src/shared/domain/types/nullable.type'

class UserService {
  private readonly repository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.repository = userRepository
  }

  async create(payload: UserPayload): Promise<IUserEntity> {
    const userCreated = UserFactory.create(payload)

    this.repository.save(userCreated)

    return userCreated
  }

  async deleteOne(id: string): Promise<void> {
    // TODO: validate that id is an id

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
}

export default UserService
