import type { RequestTwoFactorCodeUseCase } from '../../../../../core/auth/application/use-cases/request-two-factor-code.usecase'
import type { VerifyTwoFactorCodeUseCase } from '../../../../../core/auth/application/use-cases/verify-two-factor-code.usecase'
import { verificationCodeEmailTemplate } from '../../../../../infrastructure/templates/verification-code.email.template'
import { VerificationCodeType } from '../../../../../core/auth/domain/entities/verification-code.entity'
import type { AuthService } from '../../../../../core/auth/application/services/auth.service'
import type { UserRepository } from '../../../../../core/users/domain/repositories/user.repository'
import type { HashProvider } from '../../../../../core/shared/application/hash.provider'
import { InvalidCredentialsError } from '../../../../../core/auth/domain/errors/invalid-credentials.error'

export interface AuthControllerDeps {
  requestTwoFactorCode: RequestTwoFactorCodeUseCase
  verifyTwoFactorCode: VerifyTwoFactorCodeUseCase
  userRepository: UserRepository
  hashProvider: HashProvider
  authService: AuthService
}

export class AuthController {
  constructor(private readonly deps: AuthControllerDeps) {}

  async verifyTwoFactorCode(
    token: string,
    code: string,
    type: string
  ): Promise<{ message: string; redirect?: string }> {
    const tokenPayload = this.deps.authService.verifyAccessToken(token)
    if (!tokenPayload?.sub) {
      throw new InvalidCredentialsError('Invalid token')
    }

    const userId = tokenPayload.sub as string
    const verificationType = type as VerificationCodeType

    await this.deps.verifyTwoFactorCode.execute(userId, code, verificationType)

    const user = await this.deps.userRepository.findById(userId)
    if (!user) {
      throw new InvalidCredentialsError('User not found')
    }

    this.deps.authService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role
    })

    return {
      message: 'Verification successful',
      redirect: '/dashboard'
    }
  }

  async resendTwoFactorCode(token: string, type: string): Promise<void> {
    const tokenPayload = this.deps.authService.verifyAccessToken(token)
    if (!tokenPayload?.sub) {
      throw new InvalidCredentialsError('Invalid token')
    }

    const userId = tokenPayload.sub as string
    const user = await this.deps.userRepository.findById(userId)
    if (!user) {
      throw new InvalidCredentialsError('User not found')
    }

    await this.deps.requestTwoFactorCode.execute(
      userId,
      user.email,
      type as VerificationCodeType,
      verificationCodeEmailTemplate
    )
  }

  async loginWithTwoFactor(
    email: string,
    password: string
  ): Promise<{ requiresVerification: boolean; tempToken?: string }> {
    const user = await this.deps.userRepository.findByEmail(email)
    if (!user) {
      throw new InvalidCredentialsError('Invalid credentials')
    }

    const isValid = await this.deps.hashProvider.compare(password, user.password)
    if (!isValid) {
      throw new InvalidCredentialsError('Invalid credentials')
    }

    await this.deps.requestTwoFactorCode.execute(
      user.id,
      user.email,
      VerificationCodeType.LOGIN,
      verificationCodeEmailTemplate
    )

    const tempToken = this.deps.authService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role
    })

    return {
      requiresVerification: true,
      tempToken: tempToken.accessToken
    }
  }
}
