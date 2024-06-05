import type UserDTO from '@user/domain/dto/user.dto'
import UserEntity from '@user/domain/entities/user.entity'
import type UserRepository from '@user/domain/repository/user.repository'

class RegisterUser {
  constructor(private readonly repository: UserRepository) {
    this.repository = repository
  }

  async exec(payload: UserDTO): Promise<void> {
    const newUser = new UserEntity(payload)

    await this.repository.register(newUser)
  }
}

export default RegisterUser
