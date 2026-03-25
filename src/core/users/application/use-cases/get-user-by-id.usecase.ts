import type { User } from '../../domain/entities/user.entity'
import { NotFoundError } from '../../../../core/shared/errors/app-error'
import type { UserRepository } from '../../domain/repositories/user.repository'

export class GetUserByIdUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.repository.findById(id)
    if (user == null) {
      throw new NotFoundError(`Cannot find user with id: ${id}`)
    }
    return user
  }
}
