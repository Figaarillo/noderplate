import type { User } from '../../domain/entities/user.entity'
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error'
import type { UserRepository } from '../../domain/repositories/user.repository'
import type { LoginUserPayload } from '../../domain/types/payloads/login-user.payload'

export class LoginUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(payload: LoginUserPayload): Promise<User> {
    const user = await this.repository.findByEmail(payload.email)
    if (user == null) {
      throw new InvalidCredentialsError()
    }

    const isValid = this.verifyPassword(payload.password, user.password)
    if (!isValid) {
      throw new InvalidCredentialsError()
    }

    return user
  }

  private verifyPassword(password: string, hash: string): boolean {
    // TODO: Implement proper password verification with bcrypt
    // For now, comparison is done directly (not secure for production)
    return password === hash
  }
}
