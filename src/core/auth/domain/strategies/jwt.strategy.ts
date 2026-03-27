export interface IJwtStrategy {
  generateToken: (sub: string, payload: Record<string, unknown>, expiresIn: string, secret: string) => Promise<string>
  verifyToken: (token: string, secret: string) => Promise<Record<string, unknown>>
}
