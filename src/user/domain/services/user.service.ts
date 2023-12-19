import type IUserRepository from 'src/user/infrastructure/repositories/interfaces/user.repository.interface'
import UserFactory from '../factories/user.factory'
import type IUserEntity from '../interfaces/user.entity.interface'
import type UserPayload from '../payloads/user.payload'

class UserService {
  private readonly userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async create(userPayload: UserPayload): Promise<IUserEntity> {
    const userCreated = UserFactory.create(userPayload)

    this.userRepository.save(userCreated)

    return userCreated
  }

  async deleteOne(id: string): Promise<void> {
    this.userRepository.delete(id)
  }
}

export default UserService
