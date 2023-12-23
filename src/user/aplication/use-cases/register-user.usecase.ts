import type IUserEntity from '@user/domain/interfaces/user-entity.interface'
import type UserPayload from '@user/domain/payloads/user.payload'
import UserService from '@user/domain/services/user.service'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'

class RegisterUser {
  private readonly service: UserService

  constructor(repository: IUserRepository) {
    this.service = new UserService(repository)
  }

  async exec(payload: UserPayload): Promise<IUserEntity> {
    return await this.service.register(payload)
  }
}

export default RegisterUser
