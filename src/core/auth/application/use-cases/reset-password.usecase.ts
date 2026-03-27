import type { UserRepository } from '../../../users/domain/repositories/user.repository'
import type { VerificationCodeRepository } from '../../domain/repositories/verification-code.repository'
import type { HashProvider } from '../../../shared/application/hash.provider'
import { VerificationCodeType, isVerificationCodeValid } from '../../domain/entities/verification-code.entity'
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error'

export interface ResetPasswordDeps {
  userRepository: UserRepository
  verificationCodeRepository: VerificationCodeRepository
  hashProvider: HashProvider
}

export class ResetPasswordUseCase {
  private readonly deps: ResetPasswordDeps

  constructor(deps: ResetPasswordDeps) {
    this.deps = deps
  }

  async execute(email: string, code: string, newPassword: string): Promise<void> {
    const user = await this.deps.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError('Invalid or expired verification code')
    }

    const verificationCode = await this.deps.verificationCodeRepository.findByUserIdAndType(
      user.id,
      VerificationCodeType.PASSWORD_RESET
    )

    if (!verificationCode || verificationCode.code !== code || !isVerificationCodeValid(verificationCode)) {
      throw new InvalidCredentialsError('Invalid or expired verification code')
    }

    verificationCode.used = true
    await this.deps.verificationCodeRepository.save(verificationCode)

    const hashedPassword = await this.deps.hashProvider.hash(newPassword)

    await this.deps.userRepository.update(user.id, {
      password: hashedPassword
    })
  }
}
