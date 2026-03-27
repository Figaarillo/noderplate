import jwt from 'jsonwebtoken'
import type { TokenProvider, TokenPayload, AuthTokens } from '../../core/shared/application/token.provider'
import { env } from '../../app/config/env'

export class JwtTokenProvider implements TokenProvider {
  private readonly accessTokenSecret = env.jwt.accessTokenSecret
  private readonly refreshTokenSecret = env.jwt.refreshTokenSecret
  private readonly accessTokenExpiresIn = env.jwt.accessTokenExpiresIn
  private readonly refreshTokenExpiresIn = env.jwt.refreshTokenExpiresIn

  generateToken(payload: TokenPayload): AuthTokens {
    const accessToken = jwt.sign({ ...payload, type: 'access' }, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiresIn
    })

    const refreshToken = jwt.sign({ ...payload, type: 'refresh' }, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiresIn
    })

    return { accessToken, refreshToken }
  }

  verifyAccessToken(token: string): Record<string, unknown> | null {
    try {
      return jwt.verify(token, this.accessTokenSecret) as Record<string, unknown>
    } catch {
      return null
    }
  }

  verifyRefreshToken(token: string): Record<string, unknown> | null {
    try {
      return jwt.verify(token, this.refreshTokenSecret) as Record<string, unknown>
    } catch {
      return null
    }
  }
}
