import type { VerificationCode, VerificationCodeType } from '../entities/verification-code.entity'

export interface VerificationCodeRepository {
  save: (code: VerificationCode) => Promise<void>
  findByUserIdAndType: (userId: string, type: VerificationCodeType) => Promise<VerificationCode | null>
  findByCode: (code: string) => Promise<VerificationCode | null>
}
