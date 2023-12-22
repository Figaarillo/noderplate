import type IUserEntity from '@user/domain/interfaces/user.entity.interface'
import type UpdateUserPayload from '@user/domain/payloads/update-user.payload'
import UserService from '@user/domain/services/user.service'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'

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
