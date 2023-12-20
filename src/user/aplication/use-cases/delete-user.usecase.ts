import UserService from 'src/user/domain/services/user.service'
import type IUserRepository from 'src/user/infrastructure/repositories/interfaces/user.repository.interface'

class DeleteUser {
  private readonly service: UserService

  constructor(repository: IUserRepository) {
    this.service = new UserService(repository)
  }

  async exec(id: string): Promise<void> {
    await this.service.deleteOne(id)
  }
}

export default DeleteUser