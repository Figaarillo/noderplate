import type UserEntity from '@user/domain/entities/user.entity'
import UserFactory from '@user/domain/factories/user.factory'
import type IUserPayload from '@user/domain/payloads/user.payload'
import type IUserRepository from '@user/infrastructure/interfaces/user.repository.interface'

class UserCreatorUseCase {
  private readonly userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async execute(userPayload: IUserPayload): Promise<UserEntity> {
    const userCreated = UserFactory.create(userPayload)

    this.userRepository.save(userCreated)

    return userCreated
  }
}

export default UserCreatorUseCase
