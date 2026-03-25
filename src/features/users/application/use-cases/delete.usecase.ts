import type { UserRepository } from '../../domain/repositories/user.repository'

export class DeleteUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id)
  }
}
