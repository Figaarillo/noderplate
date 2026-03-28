import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class RegisterUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phoneNumber: string

  @ApiProperty({ example: 'New York' })
  @IsString()
  city: string

  @ApiProperty({ example: 'NY' })
  @IsString()
  province: string

  @ApiProperty({ example: 'USA' })
  @IsString()
  country: string

  @ApiPropertyOptional({ enum: ['user', 'admin'], default: 'user' })
  @IsOptional()
  @IsString()
  @IsEnum(['user', 'admin'])
  role?: string
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  province?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string

  @ApiPropertyOptional({ enum: ['user', 'admin'] })
  @IsOptional()
  @IsString()
  @IsEnum(['user', 'admin'])
  role?: string
}

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  offset?: number

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  limit?: number
}

export class IdParamDto {
  @ApiProperty({ description: 'User UUID' })
  @IsUUID()
  id: string
}

export class EmailQueryDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string
}

export class LoginUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password123' })
  @IsString()
  password: string
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'User UUID' })
  @IsUUID()
  userId: string

  @ApiProperty({ description: 'Current password' })
  @IsString()
  currentPassword: string

  @ApiProperty({ description: 'New password', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string
}

export class VerifyEmailDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: '123456' })
  @IsString()
  code: string
}
