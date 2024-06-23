import UserEntity from '@user/domain/entities/user.entity'
import type UserPayload from '@user/domain/payload/user.payload'
import type UserRepository from '@user/domain/repository/user.repository'

class SaveUserUseCase {
  constructor(private readonly repository: UserRepository) {
    this.repository = repository
  }

  async exec(payload: UserPayload): Promise<void> {
    const newUser = UserEntity.Create(payload)

    await this.repository.Save(newUser)
  }
}

export default SaveUserUseCase
