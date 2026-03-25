import type { User } from '../../domain/entities/user.entity'
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error'
import type { UserRepository } from '../../domain/repositories/user.repository'
import type { LoginUserPayload } from '../../domain/payloads/login-user.payload'
import argon2 from 'argon2'

export class LoginUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(payload: LoginUserPayload): Promise<User> {
    const user = await this.repository.findByEmail(payload.email)
    if (user == null) {
      throw new InvalidCredentialsError()
    }

    const isValid = await this.verifyPassword(payload.password, user.password)
    if (!isValid) {
      throw new InvalidCredentialsError()
    }

    return user
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password)
  }
}
