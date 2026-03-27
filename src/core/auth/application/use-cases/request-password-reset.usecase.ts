import type { UserRepository } from '../../../users/domain/repositories/user.repository'
import type { VerificationCodeRepository } from '../../domain/repositories/verification-code.repository'
import type { EmailProvider } from '../../../shared/application/email.provider'
import { VerificationCodeType } from '../../domain/entities/verification-code.entity'

export interface RequestPasswordResetDeps {
  userRepository: UserRepository
  verificationCodeRepository: VerificationCodeRepository
  emailProvider: EmailProvider
}

export class RequestPasswordResetUseCase {
  private readonly deps: RequestPasswordResetDeps

  constructor(deps: RequestPasswordResetDeps) {
    this.deps = deps
  }

  async execute(email: string, emailTemplate: (code: string) => string): Promise<void> {
    const user = await this.deps.userRepository.findByEmail(email)

    if (!user) {
      return
    }

    const { generateVerificationCode } = await import('../../domain/entities/verification-code.entity')
    const code = generateVerificationCode()

    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10)

    await this.deps.verificationCodeRepository.save({
      id: crypto.randomUUID(),
      userId: user.id,
      email: user.email,
      code,
      type: VerificationCodeType.PASSWORD_RESET,
      expiresAt,
      used: false,
      createdAt: new Date()
    })

    await this.deps.emailProvider.sendEmail({
      to: user.email,
      subject: 'Recuperación de contraseña',
      html: emailTemplate(code)
    })
  }
}
