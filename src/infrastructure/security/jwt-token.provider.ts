import jwt from 'jsonwebtoken'
import type { TokenProvider } from '../../core/shared/application/token.provider'

export class JwtTokenProvider implements TokenProvider {
  private readonly secret = process.env.JWT_SECRET ?? 'default-secret'
  private readonly expiresIn = '1h'

  generateToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn })
  }

  verifyToken(token: string): Record<string, unknown> | null {
    try {
      return jwt.verify(token, this.secret) as Record<string, unknown>
    } catch {
      return null
    }
  }

  generateRefreshToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, this.secret, { expiresIn: '7d' })
  }
}
