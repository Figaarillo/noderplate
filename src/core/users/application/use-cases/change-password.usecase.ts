import type { UserRepository } from '../../domain/repositories/user.repository'
import type { ChangePasswordPayload } from '../../domain/types/payloads/change-password.payload'
import type { HashProvider } from '../../../shared/application/hash.provider'
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error'

export class ChangePasswordUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly hashProvider: HashProvider
  ) {}

  async execute(payload: ChangePasswordPayload): Promise<void> {
    const user = await this.repository.findById(payload.userId)
    if (user == null) {
      throw new InvalidCredentialsError('User not found')
    }

    const isValidPassword = await this.hashProvider.compare(payload.currentPassword, user.password)
    if (!isValidPassword) {
      throw new InvalidCredentialsError('Current password is incorrect')
    }

    const newHashedPassword = await this.hashProvider.hash(payload.newPassword)

    await this.repository.update(payload.userId, {
      password: newHashedPassword
    })
  }
}
