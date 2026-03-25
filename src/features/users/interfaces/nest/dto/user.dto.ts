import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class RegisterUserDto {
  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(8)
  password: string

  @IsString()
  phoneNumber: string

  @IsString()
  city: string

  @IsString()
  province: string

  @IsString()
  country: string

  @IsOptional()
  @IsString()
  @IsEnum(['user', 'admin'])
  role?: string
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsOptional()
  @IsString()
  phoneNumber?: string

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @IsString()
  province?: string

  @IsOptional()
  @IsString()
  country?: string

  @IsOptional()
  @IsString()
  @IsEnum(['user', 'admin'])
  role?: string
}

export class PaginationQueryDto {
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  offset?: number

  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value, 10))
  limit?: number
}

export class IdParamDto {
  @IsUUID()
  id: string
}

export class EmailQueryDto {
  @IsEmail()
  email: string
}
