export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface TokenPayload {
  sub: string
  email: string
  role: string
}

export interface TokenProvider {
  generateToken: (payload: TokenPayload) => AuthTokens
  verifyAccessToken: (token: string) => Record<string, unknown> | null
  verifyRefreshToken: (token: string) => Record<string, unknown> | null
}
