import { InvalidCredentialsError } from '../../../auth/domain/errors/invalid-credentials.error'
import type { UserRepository } from '../../domain/repositories/user.repository'
import type { AuthService, AuthTokens } from '../../../auth/application/services/auth.service'

export class RefreshTokenUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly authService: AuthService
  ) {}

  async execute(refreshToken: string): Promise<AuthTokens> {
    const payload = this.authService.verifyRefreshToken(refreshToken)
    if (payload == null) {
      throw new InvalidCredentialsError('Invalid refresh token')
    }

    if (payload.type !== 'refresh') {
      throw new InvalidCredentialsError('Invalid token type')
    }

    const userId = payload.sub as string
    const user = await this.repository.findById(userId)
    if (user == null) {
      throw new InvalidCredentialsError('User not found')
    }

    return this.authService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role
    })
  }
}
