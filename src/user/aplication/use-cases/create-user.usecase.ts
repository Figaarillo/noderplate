import type IUserEntity from '../../domain/interfaces/user.entity.interface'
import type UserPayload from '../../domain/payloads/user.payload'
import UserService from '../../domain/services/user.service'
import type IUserRepository from '../../infrastructure/repositories/interfaces/user.repository.interface'

class CreateUser {
  private readonly service: UserService

  constructor(repository: IUserRepository) {
    this.service = new UserService(repository)
  }

  async exec(payload: UserPayload): Promise<IUserEntity> {
    return await this.service.create(payload)
  }
}

export default CreateUser
