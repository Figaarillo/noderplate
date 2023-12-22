import type Nullable from '@shared/domain/types/nullable.type'
import type IUserEntity from '@user/domain/interfaces/user.entity.interface'
import UserService from '@user/domain/services/user.service'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'

class GetUser {
  private readonly service: UserService

  constructor(repository: IUserRepository) {
    this.service = new UserService(repository)
  }

  async exec(id: string): Promise<Nullable<IUserEntity>> {
    return await this.service.getOneById(id)
  }
}

export default GetUser
