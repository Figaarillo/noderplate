import type UserDTO from '@user/domain/dto/user.dto'
import UserEntity from '@user/domain/entities/user.entity'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'

class RegisterUser {
  constructor(private readonly repository: IUserRepository) {
    this.repository = repository
  }

  async exec(payload: UserDTO): Promise<UserEntity> {
    const newUser = new UserEntity(payload)

    return await this.repository.save(newUser)
  }
}

export default RegisterUser
