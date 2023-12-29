import type IUpdateUserData from '@user/domain/interfaces/update-user-data.interface'
import type IUserEntity from '@user/domain/interfaces/user-entity.interface'
import UserService from '@user/domain/services/user.service'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'

class UpdateUser {
  private readonly service: UserService

  constructor(repository: IUserRepository) {
    this.service = new UserService(repository)
  }

  async exec(payload: IUpdateUserData): Promise<IUserEntity> {
    const { id, ...userPayload } = payload

    const userUpdated = await this.service.update(id, userPayload)

    return userUpdated
  }
}

export default UpdateUser
