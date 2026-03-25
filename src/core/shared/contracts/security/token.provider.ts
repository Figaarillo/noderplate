export interface TokenProvider {
  generateToken: (payload: Record<string, unknown>) => string
  verifyToken: (token: string) => Record<string, unknown> | null
  generateRefreshToken: () => string
}
