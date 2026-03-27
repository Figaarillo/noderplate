import { IsString } from 'class-validator'

export class VerifyTwoFactorCodeDto {
  @IsString()
  token: string

  @IsString()
  code: string

  @IsString()
  type: string
}

export class ResendTwoFactorCodeDto {
  @IsString()
  token: string

  @IsString()
  type: string
}

export class LoginWithTwoFactorDto {
  @IsString()
  email: string

  @IsString()
  password: string
}

export class ForgotPasswordDto {
  @IsString()
  email: string
}

export class ResetPasswordDto {
  @IsString()
  token: string

  @IsString()
  code: string

  @IsString()
  newPassword: string
}
