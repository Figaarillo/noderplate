import jwt from 'jsonwebtoken'
import type { IJwtStrategy } from '../../../core/auth/domain/strategies/jwt.strategy'

export default class JwtStrategy implements IJwtStrategy {
  async generateToken(
    sub: string,
    payload: Record<string, unknown>,
    expiresIn: string,
    secret: string
  ): Promise<string> {
    return jwt.sign({ sub, ...payload }, secret, { algorithm: 'HS256', expiresIn: expiresIn === '' ? '1h' : expiresIn })
  }

  async verifyToken(token: string, secret: string): Promise<Record<string, unknown>> {
    return jwt.verify(token, secret) as Record<string, unknown>
  }
}
