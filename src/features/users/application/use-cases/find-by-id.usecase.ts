import type { User } from '../../domain/entities/user.entity'
import { UserNotFoundError } from '../../domain/errors/user-not-found.error'
import type { UserRepository } from '../../domain/repositories/user.repository'

export class FindByIdUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.repository.findById(id)
    if (user == null) {
      throw new UserNotFoundError()
    }
    return user
  }
}
