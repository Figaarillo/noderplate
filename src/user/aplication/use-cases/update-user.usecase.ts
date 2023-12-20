import type IUserEntity from 'src/user/domain/interfaces/user.entity.interface'
import type UserPayload from 'src/user/domain/payloads/user.payload'
import UserService from 'src/user/domain/services/user.service'
import type IUserRepository from 'src/user/infrastructure/repositories/interfaces/user.repository.interface'

class UpdateUser {
  private readonly service: UserService

  constructor(repository: IUserRepository) {
    this.service = new UserService(repository)
  }

  async exec(payload: UpdateUserPayload): Promise<IUserEntity> {
    const { id, ...userPayload } = payload

    const userUpdated = await this.service.update(id, userPayload)

    return userUpdated
  }
}

export default UpdateUser
