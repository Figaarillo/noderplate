import type UserDTO from '@user/domain/dto/user.dto'
import type UserEntity from '@user/domain/entities/user.entity'
import UserNotFoundException from '@user/domain/exceptions/user-not-found.exception'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'

class UpdateUser {
  constructor(private readonly repository: IUserRepository) {
    this.repository = repository
  }

  async exec(id: string, payload: UserDTO): Promise<UserEntity> {
    const userUpdated = await this.repository.update(id, payload)
    if (userUpdated == null) {
      throw new UserNotFoundException()
    }

    return userUpdated
  }
}

export default UpdateUser
