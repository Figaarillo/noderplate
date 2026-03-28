import type { TokenProvider, AuthTokens, TokenPayload } from '../../../shared/application/token.provider'

export type { AuthTokens }

export class AuthService {
  constructor(readonly tokenProvider: TokenProvider) {}

  generateTokens(payload: TokenPayload): AuthTokens {
    return this.tokenProvider.generateToken(payload)
  }

  verifyAccessToken(token: string): Record<string, unknown> | null {
    return this.tokenProvider.verifyAccessToken(token)
  }

  verifyRefreshToken(token: string): Record<string, unknown> | null {
    return this.tokenProvider.verifyRefreshToken(token)
  }
}
