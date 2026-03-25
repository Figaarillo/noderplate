import type { User } from '../../domain/entities/user.entity'
import { UserNotFoundError } from '../../domain/errors/user-not-found.error'
import type { UserRepository } from '../../domain/repositories/user.repository'

export class ListUsersUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(offset: number, limit: number): Promise<User[]> {
    const users = await this.repository.list(offset, limit)
    if (users == null || users.length === 0) {
      throw new UserNotFoundError()
    }
    return users
  }
}
