import type {
  VerificationCode,
  VerificationCodeType
} from '../../../core/auth/domain/entities/verification-code.entity'
import type { VerificationCodeRepository } from '../../../core/auth/domain/repositories/verification-code.repository'

export class InMemoryVerificationCodeRepository implements VerificationCodeRepository {
  private readonly codes = new Map<string, VerificationCode>()

  async save(code: VerificationCode): Promise<void> {
    this.codes.set(code.id, code)
  }

  async findByUserIdAndType(userId: string, type: VerificationCodeType): Promise<VerificationCode | null> {
    for (const code of this.codes.values()) {
      if (code.userId === userId && code.type === type && !code.used) {
        return code
      }
    }
    return null
  }

  async findByCode(code: string): Promise<VerificationCode | null> {
    for (const vCode of this.codes.values()) {
      if (vCode.code === code) {
        return vCode
      }
    }
    return null
  }
}
