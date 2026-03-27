import type { VerificationCodeRepository } from '../../domain/repositories/verification-code.repository'
import type { EmailProvider } from '../../../shared/application/email.provider'
import type { VerificationCodeType } from '../../domain/entities/verification-code.entity'
import { TwoFactorAuthService } from '../services/two-factor-auth.service'

export interface RequestTwoFactorCodeDeps {
  verificationCodeRepository: VerificationCodeRepository
  emailProvider: EmailProvider
}

export class RequestTwoFactorCodeUseCase {
  private readonly twoFactorAuth: TwoFactorAuthService

  constructor(deps: RequestTwoFactorCodeDeps) {
    this.twoFactorAuth = new TwoFactorAuthService({
      emailProvider: deps.emailProvider,
      saveVerificationCode: deps.verificationCodeRepository.save.bind(deps.verificationCodeRepository),
      findPendingVerificationCode: deps.verificationCodeRepository.findByUserIdAndType.bind(
        deps.verificationCodeRepository
      )
    })
  }

  get twoFactorAuthService(): TwoFactorAuthService {
    return this.twoFactorAuth
  }

  async execute(
    userId: string,
    email: string,
    type: VerificationCodeType,
    template: (code: string) => string
  ): Promise<void> {
    await this.twoFactorAuth.sendVerificationCode(userId, email, type, template)
  }
}
