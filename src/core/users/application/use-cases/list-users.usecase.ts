import type { User } from '../../domain/entities/user.entity'
import { NotFoundError } from '../../../../core/shared/errors/app-error'
import type { UserRepository } from '../../domain/repositories/user.repository'

export class ListUsersUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(offset: number = 0, limit: number = 10): Promise<User[]> {
    const users = await this.repository.list(offset, limit)
    if (users == null || users.length === 0) {
      throw new NotFoundError('No users found')
    }
    return users
  }
}
