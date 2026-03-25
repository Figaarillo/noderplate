import type { User } from '../../domain/entities/user.entity'
import { UserNotFoundError } from '../../domain/errors/user-not-found.error'
import type { UserRepository } from '../../domain/repositories/user.repository'
import type { UpdateUserPayload } from '../../domain/payloads/update-user.payload'

export class UpdateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string, payload: UpdateUserPayload): Promise<User> {
    const userUpdated = await this.repository.update(id, payload)
    if (userUpdated == null) {
      throw new UserNotFoundError()
    }
    return userUpdated
  }
}
