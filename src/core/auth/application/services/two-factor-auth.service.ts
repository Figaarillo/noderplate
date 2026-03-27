import type { EmailProvider } from '../../../shared/application/email.provider'
import {
  type VerificationCode,
  type VerificationCodeType,
  generateVerificationCode,
  VerificationCodeType as VerificationCodeTypeEnum
} from '../../domain/entities/verification-code.entity'

export interface TwoFactorAuthDeps {
  emailProvider: EmailProvider
  saveVerificationCode: (code: VerificationCode) => Promise<void>
  findPendingVerificationCode: (userId: string, type: VerificationCodeType) => Promise<VerificationCode | null>
}

export class TwoFactorAuthService {
  private readonly codeExpiresInMinutes = 10

  constructor(private readonly deps: TwoFactorAuthDeps) {}

  async sendVerificationCode(
    userId: string,
    email: string,
    type: VerificationCodeType,
    template: (code: string) => string
  ): Promise<void> {
    const existingCode = await this.deps.findPendingVerificationCode(userId, type)
    if (existingCode != null) {
      throw new Error('A verification code has already been sent. Please wait before requesting another.')
    }

    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + this.codeExpiresInMinutes * 60 * 1000)

    const verificationCode: VerificationCode = {
      id: crypto.randomUUID(),
      userId,
      email,
      code,
      type,
      expiresAt,
      used: false,
      createdAt: new Date()
    }

    await this.deps.saveVerificationCode(verificationCode)

    await this.deps.emailProvider.sendEmail({
      to: email,
      subject: this.getEmailSubject(type),
      html: template(code)
    })
  }

  async verifyCode(userId: string, code: string, type: VerificationCodeType): Promise<VerificationCode> {
    const verificationCode = await this.deps.findPendingVerificationCode(userId, type)

    if (verificationCode == null) {
      throw new Error('No verification code found')
    }

    if (verificationCode.code !== code) {
      throw new Error('Invalid verification code')
    }

    if (new Date() > verificationCode.expiresAt) {
      throw new Error('Verification code has expired')
    }

    if (verificationCode.used) {
      throw new Error('Verification code has already been used')
    }

    verificationCode.used = true
    await this.deps.saveVerificationCode(verificationCode)

    return verificationCode
  }

  private getEmailSubject(type: VerificationCodeType): string {
    switch (type) {
      case VerificationCodeTypeEnum.LOGIN:
        return 'Your login verification code'
      case VerificationCodeTypeEnum.REGISTER:
        return 'Welcome! Verify your email'
      case VerificationCodeTypeEnum.PASSWORD_RESET:
        return 'Reset your password'
      case VerificationCodeTypeEnum.EMAIL_VERIFICATION:
        return 'Verify your email address'
      default:
        return 'Verification code'
    }
  }
}
