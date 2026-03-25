import type { User, UpdateUserInput } from '../../domain/entities/user.entity'
import { NotFoundError } from '../../../../core/shared/errors/app-error'
import type { UserRepository } from '../../domain/repositories/user.repository'

export class UpdateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string, input: UpdateUserInput): Promise<User> {
    const userUpdated = await this.repository.update(id, input)
    if (userUpdated == null) {
      throw new NotFoundError(`Cannot update user with id: ${id}`)
    }
    return userUpdated
  }
}
