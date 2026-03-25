import type { User, CreateUserInput } from '../../domain/entities/user.entity'
import type { UserRepository } from '../../domain/repositories/user.repository'

export class CreateUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser = await this.repository.findByEmail(input.email)
    if (existingUser != null) {
      throw new Error('User already exists')
    }

    const user: User = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...input
    }

    return await this.repository.save(user)
  }
}
