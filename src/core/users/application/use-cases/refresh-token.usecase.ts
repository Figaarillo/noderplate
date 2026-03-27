import type { User } from '../../domain/entities/user.entity'
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error'
import type { UserRepository } from '../../domain/repositories/user.repository'
import type { TokenProvider } from '../../../shared/application/token.provider'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export class RefreshTokenUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly tokenProvider: TokenProvider
  ) {}

  async execute(refreshToken: string): Promise<AuthTokens> {
    const payload = this.tokenProvider.verifyToken(refreshToken)
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

    return this.generateTokens(user)
  }

  private generateTokens(user: User): AuthTokens {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    }

    const accessToken = this.tokenProvider.generateToken({
      ...payload,
      type: 'access'
    })

    const newRefreshToken = this.tokenProvider.generateRefreshToken({
      ...payload,
      type: 'refresh'
    })

    return { accessToken, refreshToken: newRefreshToken }
  }
}
