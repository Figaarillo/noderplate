import { Module } from '@nestjs/common'
import type { UserRepository } from '../../../../../core/users/domain/repositories/user.repository'
import type { HashProvider } from '../../../../../core/shared/application/hash.provider'
import type { TokenProvider } from '../../../../../core/shared/application/token.provider'
import { AuthService } from '../../../../../core/auth/application/services/auth.service'
import type { EmailProvider } from '../../../../../core/shared/application/email.provider'
import type { VerificationCodeRepository } from '../../../../../core/auth/domain/repositories/verification-code.repository'
import { RequestTwoFactorCodeUseCase } from '../../../../../core/auth/application/use-cases/request-two-factor-code.usecase'
import { VerifyTwoFactorCodeUseCase } from '../../../../../core/auth/application/use-cases/verify-two-factor-code.usecase'
import { RequestPasswordResetUseCase } from '../../../../../core/auth/application/use-cases/request-password-reset.usecase'
import { ResetPasswordUseCase } from '../../../../../core/auth/application/use-cases/reset-password.usecase'
import { PrismaUserRepository } from '../../../../../infrastructure/persistence/prisma/users/repositories/user.repository'
import { BcryptHashProvider } from '../../../../../infrastructure/security/bcrypt-hash.provider'
import { JwtTokenProvider } from '../../../../../infrastructure/security/jwt-token.provider'
import { NodemailerEmailProvider } from '../../../../../infrastructure/email/nodemailer.provider'
import { InMemoryVerificationCodeRepository } from '../../../../../infrastructure/persistence/in-memory/verification-code.repository'
import { AuthController } from '../controllers/auth.controller'

const USER_REPOSITORY = 'USER_REPOSITORY'
const HASH_PROVIDER = 'HASH_PROVIDER'
const TOKEN_PROVIDER = 'TOKEN_PROVIDER'
const AUTH_SERVICE = 'AUTH_SERVICE'
const EMAIL_PROVIDER = 'EMAIL_PROVIDER'
const VERIFICATION_CODE_REPOSITORY = 'VERIFICATION_CODE_REPOSITORY'
const REQUEST_TWO_FACTOR_CODE_USE_CASE = 'REQUEST_TWO_FACTOR_CODE_USE_CASE'
const VERIFY_TWO_FACTOR_CODE_USE_CASE = 'VERIFY_TWO_FACTOR_CODE_USE_CASE'
const REQUEST_PASSWORD_RESET_USE_CASE = 'REQUEST_PASSWORD_RESET_USE_CASE'
const RESET_PASSWORD_USE_CASE = 'RESET_PASSWORD_USE_CASE'

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useFactory: (): UserRepository => new PrismaUserRepository()
    },
    {
      provide: HASH_PROVIDER,
      useFactory: (): HashProvider => new BcryptHashProvider()
    },
    {
      provide: TOKEN_PROVIDER,
      useFactory: (): TokenProvider => new JwtTokenProvider()
    },
    {
      provide: AUTH_SERVICE,
      useFactory: (tokenProvider: TokenProvider): AuthService => new AuthService(tokenProvider),
      inject: [TOKEN_PROVIDER]
    },
    {
      provide: EMAIL_PROVIDER,
      useFactory: (): EmailProvider => new NodemailerEmailProvider()
    },
    {
      provide: VERIFICATION_CODE_REPOSITORY,
      useFactory: (): VerificationCodeRepository => new InMemoryVerificationCodeRepository()
    },
    {
      provide: REQUEST_TWO_FACTOR_CODE_USE_CASE,
      useFactory: (
        verificationCodeRepository: VerificationCodeRepository,
        emailProvider: EmailProvider
      ): RequestTwoFactorCodeUseCase => {
        return new RequestTwoFactorCodeUseCase({
          verificationCodeRepository,
          emailProvider
        })
      },
      inject: [VERIFICATION_CODE_REPOSITORY, EMAIL_PROVIDER]
    },
    {
      provide: VERIFY_TWO_FACTOR_CODE_USE_CASE,
      useFactory: (verificationCodeRepository: VerificationCodeRepository): VerifyTwoFactorCodeUseCase => {
        return new VerifyTwoFactorCodeUseCase({
          verificationCodeRepository
        })
      },
      inject: [VERIFICATION_CODE_REPOSITORY]
    },
    {
      provide: REQUEST_PASSWORD_RESET_USE_CASE,
      useFactory: (
        verificationCodeRepository: VerificationCodeRepository,
        emailProvider: EmailProvider
      ): RequestPasswordResetUseCase => {
        return new RequestPasswordResetUseCase({
          userRepository: new PrismaUserRepository(),
          verificationCodeRepository,
          emailProvider
        })
      },
      inject: [VERIFICATION_CODE_REPOSITORY, EMAIL_PROVIDER]
    },
    {
      provide: RESET_PASSWORD_USE_CASE,
      useFactory: (
        verificationCodeRepository: VerificationCodeRepository,
        hashProvider: HashProvider
      ): ResetPasswordUseCase => {
        return new ResetPasswordUseCase({
          userRepository: new PrismaUserRepository(),
          verificationCodeRepository,
          hashProvider
        })
      },
      inject: [VERIFICATION_CODE_REPOSITORY, HASH_PROVIDER]
    }
  ]
})
export class AuthModule {}
