import { Controller, Get, Post, Body, Query, Res, HttpStatus, Inject } from '@nestjs/common'
import { Response } from 'express'
import {
  verificationPageHtml,
  verificationCodeEmailTemplate,
  passwordResetPageHtml,
  passwordResetEmailTemplate
} from '../../../../../infrastructure/templates/verification-code.email.template'
import { VerificationCodeType } from '../../../../../core/auth/domain/entities/verification-code.entity'
import { InvalidCredentialsError } from '../../../../../core/auth/domain/errors/invalid-credentials.error'
import { RequestTwoFactorCodeUseCase } from '../../../../../core/auth/application/use-cases/request-two-factor-code.usecase'
import { VerifyTwoFactorCodeUseCase } from '../../../../../core/auth/application/use-cases/verify-two-factor-code.usecase'
import { RequestPasswordResetUseCase } from '../../../../../core/auth/application/use-cases/request-password-reset.usecase'
import { ResetPasswordUseCase } from '../../../../../core/auth/application/use-cases/reset-password.usecase'
import { AuthService } from '../../../../../core/auth/application/services/auth.service'
import { UserRepository } from '../../../../../core/users/domain/repositories/user.repository'
import { HashProvider } from '../../../../../core/shared/application/hash.provider'
import { TokenProvider } from '../../../../../core/shared/application/token.provider'
import {
  VerifyTwoFactorCodeDto,
  ResendTwoFactorCodeDto,
  LoginWithTwoFactorDto,
  ForgotPasswordDto,
  ResetPasswordDto
} from '../schemas/auth-2fa.dto'

export const REQUEST_TWO_FACTOR_CODE_USE_CASE = 'REQUEST_TWO_FACTOR_CODE_USE_CASE'
export const VERIFY_TWO_FACTOR_CODE_USE_CASE = 'VERIFY_TWO_FACTOR_CODE_USE_CASE'
export const REQUEST_PASSWORD_RESET_USE_CASE = 'REQUEST_PASSWORD_RESET_USE_CASE'
export const RESET_PASSWORD_USE_CASE = 'RESET_PASSWORD_USE_CASE'
export const USER_REPOSITORY = 'USER_REPOSITORY'
export const HASH_PROVIDER = 'HASH_PROVIDER'
export const AUTH_SERVICE = 'AUTH_SERVICE'
export const TOKEN_PROVIDER = 'TOKEN_PROVIDER'
export const EMAIL_PROVIDER = 'EMAIL_PROVIDER'
export const VERIFICATION_CODE_REPOSITORY = 'VERIFICATION_CODE_REPOSITORY'

@Controller()
export class AuthController {
  constructor(
    @Inject(REQUEST_TWO_FACTOR_CODE_USE_CASE) private readonly requestTwoFactorCode: RequestTwoFactorCodeUseCase,
    @Inject(VERIFY_TWO_FACTOR_CODE_USE_CASE) private readonly verifyTwoFactorCode: VerifyTwoFactorCodeUseCase,
    @Inject(REQUEST_PASSWORD_RESET_USE_CASE) private readonly requestPasswordReset: RequestPasswordResetUseCase,
    @Inject(RESET_PASSWORD_USE_CASE) private readonly resetPasswordUseCase: ResetPasswordUseCase,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(HASH_PROVIDER) private readonly hashProvider: HashProvider,
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
    @Inject(TOKEN_PROVIDER) private readonly tokenProvider: TokenProvider
  ) {}

  @Get('auth/verify')
  getVerificationPage(@Query('token') token: string, @Query('type') type: string, @Res() res: Response): Response {
    if (!token || !type) {
      return res.status(HttpStatus.BAD_REQUEST).send('Missing token or type parameter')
    }

    const html = verificationPageHtml(token, type)
    return res.status(HttpStatus.OK).type('text/html').send(html)
  }

  @Get('auth/reset-password')
  getResetPasswordPage(@Query('token') token: string, @Res() res: Response): Response {
    if (!token) {
      return res.status(HttpStatus.BAD_REQUEST).send('Missing token parameter')
    }

    const html = passwordResetPageHtml(token)
    return res.status(HttpStatus.OK).type('text/html').send(html)
  }

  @Post('api/auth/verify-2fa')
  async verifyTwoFactor(@Body() dto: VerifyTwoFactorCodeDto): Promise<{ message: string; redirect?: string }> {
    const tokenPayload = this.authService.verifyAccessToken(dto.token)
    if (!tokenPayload?.sub) {
      throw new InvalidCredentialsError('Invalid token')
    }

    const userId = tokenPayload.sub as string
    const verificationType = dto.type as VerificationCodeType

    await this.verifyTwoFactorCode.execute(userId, dto.code, verificationType)

    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new InvalidCredentialsError('User not found')
    }

    this.authService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role
    })

    return {
      message: 'Verification successful',
      redirect: '/dashboard'
    }
  }

  @Post('api/auth/resend-2fa')
  async resendTwoFactorCode(@Body() dto: ResendTwoFactorCodeDto): Promise<{ message: string }> {
    const tokenPayload = this.authService.verifyAccessToken(dto.token)
    if (!tokenPayload?.sub) {
      throw new InvalidCredentialsError('Invalid token')
    }

    const userId = tokenPayload.sub as string
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new InvalidCredentialsError('User not found')
    }

    await this.requestTwoFactorCode.execute(
      userId,
      user.email,
      dto.type as VerificationCodeType,
      verificationCodeEmailTemplate
    )

    return { message: 'Code resent successfully' }
  }

  @Post('api/auth/login-2fa')
  async loginWithTwoFactor(
    @Body() dto: LoginWithTwoFactorDto
  ): Promise<{ requiresVerification: boolean; tempToken?: string }> {
    const user = await this.userRepository.findByEmail(dto.email)
    if (!user) {
      throw new InvalidCredentialsError('Invalid credentials')
    }

    const isValid = await this.hashProvider.compare(dto.password, user.password)
    if (!isValid) {
      throw new InvalidCredentialsError('Invalid credentials')
    }

    await this.requestTwoFactorCode.execute(
      user.id,
      user.email,
      VerificationCodeType.LOGIN,
      verificationCodeEmailTemplate
    )

    const tempToken = this.authService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role
    })

    return {
      requiresVerification: true,
      tempToken: tempToken.accessToken
    }
  }

  @Post('api/auth/forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ message: string }> {
    await this.requestPasswordReset.execute(dto.email, passwordResetEmailTemplate)
    return { message: 'If the email exists, a verification code has been sent' }
  }

  @Post('api/auth/reset-password')
  async resetPasswordEndpoint(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    const tokenPayload = this.tokenProvider.verifyAccessToken(dto.token)
    if (!tokenPayload?.sub) {
      throw new InvalidCredentialsError('Invalid or expired token')
    }

    const email = tokenPayload.email as string

    await this.resetPasswordUseCase.execute(email, dto.code, dto.newPassword)

    return { message: 'Password reset successfully' }
  }
}
