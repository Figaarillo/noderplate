import type { UserRepository } from '../../domain/repositories/user.repository'

export class DeleteUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.repository.findById(id)
    if (user == null) {
      throw new Error(`User with id ${id} not found`)
    }
    await this.repository.delete(id)
  }
}
