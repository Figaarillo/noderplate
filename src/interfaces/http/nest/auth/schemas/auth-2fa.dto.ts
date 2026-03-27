import { IsString, IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class VerifyTwoFactorCodeDto {
  @ApiProperty({ description: 'Temporary JWT token from login-2fa' })
  @IsString()
  token: string

  @ApiProperty({ description: '6-digit verification code', pattern: '^[0-9]{6}$' })
  @IsString()
  code: string

  @ApiProperty({ enum: ['LOGIN', 'REGISTER', 'PASSWORD_RESET', 'EMAIL_VERIFICATION'] })
  @IsString()
  type: string
}

export class ResendTwoFactorCodeDto {
  @ApiProperty()
  @IsString()
  token: string

  @ApiProperty({ enum: ['LOGIN', 'REGISTER', 'PASSWORD_RESET', 'EMAIL_VERIFICATION'] })
  @IsString()
  type: string
}

export class LoginWithTwoFactorDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Temporary JWT token' })
  @IsString()
  token: string

  @ApiProperty({ description: '6-digit verification code', pattern: '^[0-9]{6}$' })
  @IsString()
  code: string

  @ApiProperty({ description: 'New password', minLength: 6 })
  @IsString()
  newPassword: string
}
