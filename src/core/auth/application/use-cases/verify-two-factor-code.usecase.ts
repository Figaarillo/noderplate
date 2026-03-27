import type { VerificationCodeRepository } from '../../domain/repositories/verification-code.repository'
import type { VerificationCodeType } from '../../domain/entities/verification-code.entity'
import { TwoFactorAuthService } from '../services/two-factor-auth.service'

export interface VerifyTwoFactorCodeDeps {
  verificationCodeRepository: VerificationCodeRepository
}

export class VerifyTwoFactorCodeUseCase {
  private readonly twoFactorAuth: TwoFactorAuthService

  constructor(deps: VerifyTwoFactorCodeDeps) {
    this.twoFactorAuth = new TwoFactorAuthService({
      emailProvider: {
        sendEmail: async () => {}
      },
      saveVerificationCode: deps.verificationCodeRepository.save.bind(deps.verificationCodeRepository),
      findPendingVerificationCode: deps.verificationCodeRepository.findByUserIdAndType.bind(
        deps.verificationCodeRepository
      )
    })
  }

  async execute(userId: string, code: string, type: VerificationCodeType): Promise<void> {
    await this.twoFactorAuth.verifyCode(userId, code, type)
  }
}
