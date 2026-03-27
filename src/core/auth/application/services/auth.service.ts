import type { TokenProvider } from '../../../shared/application/token.provider'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface TokenPayload {
  sub: string
  email: string
  role: string
}

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
