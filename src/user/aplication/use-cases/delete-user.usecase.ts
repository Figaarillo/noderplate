import type IUserEntity from '@user/domain/interfaces/user-entity.interface'
import UserService from '@user/domain/services/user.service'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'

class DeleteUser {
  private readonly service: UserService

  constructor(repository: IUserRepository) {
    this.service = new UserService(repository)
  }

  async exec(id: string): Promise<IUserEntity> {
    const userDeleted = await this.service.deleteOne(id)

    return userDeleted
  }
}

export default DeleteUser
