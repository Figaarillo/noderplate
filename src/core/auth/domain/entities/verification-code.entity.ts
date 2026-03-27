export interface VerificationCode {
  id: string
  userId: string
  email: string
  code: string
  type: VerificationCodeType
  expiresAt: Date
  used: boolean
  createdAt: Date
}

export enum VerificationCodeType {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  PASSWORD_RESET = 'PASSWORD_RESET',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION'
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function isVerificationCodeValid(code: VerificationCode): boolean {
  return !code.used && new Date() < code.expiresAt
}
