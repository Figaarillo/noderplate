import type { User } from '../../domain/entities/user.entity'
import { InvalidCredentialsError } from '../../../auth/domain/errors/invalid-credentials.error'
import type { UserRepository } from '../../domain/repositories/user.repository'
import type { LoginUserPayload } from '../../domain/types/payloads/login-user.payload'
import type { HashProvider } from '../../../shared/application/hash.provider'
import type { AuthService, AuthTokens } from '../../../auth/application/services/auth.service'

export class LoginUserUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly authService: AuthService
  ) {}

  async execute(payload: LoginUserPayload): Promise<{ user: User; tokens: AuthTokens }> {
    const user = await this.repository.findByEmail(payload.email)
    if (user == null) {
      throw new InvalidCredentialsError()
    }

    const isValid = await this.hashProvider.compare(payload.password, user.password)
    if (!isValid) {
      throw new InvalidCredentialsError()
    }

    const tokens = this.authService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role
    })

    return { user, tokens }
  }
}
