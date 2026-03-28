import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, Inject } from '@nestjs/common'
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger'
import { ListUsersUseCase } from '../../../../../core/users/application/use-cases/list.usecase'
import { FindByIdUseCase } from '../../../../../core/users/application/use-cases/find-by-id.usecase'
import { FindByEmailUseCase } from '../../../../../core/users/application/use-cases/find-by-email.usecase'
import { RegisterUserUseCase } from '../../../../../core/users/application/use-cases/register.usecase'
import { VerifyEmailUseCase } from '../../../../../core/users/application/use-cases/verify-email.usecase'
import { LoginUserUseCase } from '../../../../../core/users/application/use-cases/login.usecase'
import { RefreshTokenUseCase } from '../../../../../core/users/application/use-cases/refresh-token.usecase'
import { ChangePasswordUseCase } from '../../../../../core/users/application/use-cases/change-password.usecase'
import { UpdateUserUseCase } from '../../../../../core/users/application/use-cases/update.usecase'
import { DeleteUserUseCase } from '../../../../../core/users/application/use-cases/delete.usecase'
import type { RegisterUserPayload } from '../../../../../core/users/domain/types/payloads/register-user.payload'
import type { LoginUserPayload } from '../../../../../core/users/domain/types/payloads/login-user.payload'
import type { UpdateUserPayload } from '../../../../../core/users/domain/types/payloads/update-user.payload'
import type { ChangePasswordPayload } from '../../../../../core/users/domain/types/payloads/change-password.payload'
import {
  RegisterUserDto,
  VerifyEmailDto,
  UpdateUserDto,
  PaginationQueryDto,
  IdParamDto,
  EmailQueryDto,
  LoginUserDto,
  ChangePasswordDto
} from '../schemas/user.dto'
import {
  LIST_USERS_USE_CASE,
  FIND_BY_ID_USE_CASE,
  FIND_BY_EMAIL_USE_CASE,
  REGISTER_USER_USE_CASE,
  VERIFY_EMAIL_USE_CASE,
  LOGIN_USER_USE_CASE,
  REFRESH_TOKEN_USE_CASE,
  CHANGE_PASSWORD_USE_CASE,
  UPDATE_USER_USE_CASE,
  DELETE_USER_USE_CASE
} from '../providers/users.providers'

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(
    @Inject(LIST_USERS_USE_CASE) private readonly listUsersUseCase: ListUsersUseCase,
    @Inject(FIND_BY_ID_USE_CASE) private readonly findByIdUseCase: FindByIdUseCase,
    @Inject(FIND_BY_EMAIL_USE_CASE) private readonly findByEmailUseCase: FindByEmailUseCase,
    @Inject(REGISTER_USER_USE_CASE) private readonly registerUserUseCase: RegisterUserUseCase,
    @Inject(VERIFY_EMAIL_USE_CASE) private readonly verifyEmailUseCase: VerifyEmailUseCase,
    @Inject(LOGIN_USER_USE_CASE) private readonly loginUserUseCase: LoginUserUseCase,
    @Inject(REFRESH_TOKEN_USE_CASE) private readonly refreshTokenUseCase: RefreshTokenUseCase,
    @Inject(CHANGE_PASSWORD_USE_CASE) private readonly changePasswordUseCase: ChangePasswordUseCase,
    @Inject(UPDATE_USER_USE_CASE) private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject(DELETE_USER_USE_CASE) private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all users', description: 'Returns a paginated list of users' })
  @ApiQuery({ name: 'offset', required: false, type: Number, default: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    schema: { example: { data: [{ id: 'uuid', email: 'user@example.com', firstName: 'John', lastName: 'Doe' }] } }
  })
  async list(@Query() query: PaginationQueryDto): Promise<{ data: unknown[] }> {
    const offset = query.offset ?? 0
    const limit = query.limit ?? 10

    const users = await this.listUsersUseCase.execute(offset, limit)
    return { data: users }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param() params: IdParamDto): Promise<{ data: unknown }> {
    const user = await this.findByIdUseCase.execute(params.id)
    return { data: user }
  }

  @Get('email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiQuery({ name: 'email', description: 'User email', example: 'user@example.com' })
  @ApiResponse({ status: 200, description: 'User found' })
  async findByEmail(@Query() query: EmailQueryDto): Promise<{ data: unknown }> {
    const user = await this.findByEmailUseCase.execute(query.email)
    return { data: user }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully. Please verify your email.',
    schema: { example: { data: { id: 'uuid', message: 'Usuario registrado. Por favor verifica tu email.' } } }
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async register(@Body() dto: RegisterUserDto): Promise<{ data: { id: string; message: string } }> {
    const payload: RegisterUserPayload = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      phoneNumber: dto.phoneNumber,
      city: dto.city,
      province: dto.province,
      country: dto.country,
      role: dto.role ?? 'user'
    }

    const result = await this.registerUserUseCase.execute(payload)
    return { data: { id: result.user.id, message: 'Usuario registrado. Por favor verifica tu email.' } }
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify email', description: 'Verify user email with verification code' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    schema: { example: { data: { success: true, message: 'Email verificado correctamente' } } }
  })
  @ApiResponse({ status: 400, description: 'Invalid verification code' })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<{ data: { success: boolean; message: string } }> {
    const result = await this.verifyEmailUseCase.execute(dto.email, dto.code)
    return { data: result }
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'Login user', description: 'Authenticate user and receive JWT tokens in cookies' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: { example: { data: { id: 'uuid', tokens: { accessToken: 'eyJhbGci...', refreshToken: 'eyJhbGci...' } } } }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() dto: LoginUserDto
  ): Promise<{ data: { id: string; tokens: { accessToken: string; refreshToken: string } } }> {
    const payload: LoginUserPayload = {
      email: dto.email,
      password: dto.password
    }

    const result = await this.loginUserUseCase.execute(payload)
    return { data: { id: result.user.id, tokens: result.tokens } }
  }

  @Post('auth/refresh')
  @ApiOperation({ summary: 'Refresh access token', description: 'Refresh JWT access token using refresh token cookie' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed',
    schema: { example: { data: { accessToken: 'eyJhbGci...', refreshToken: 'eyJhbGci...' } } }
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(
    @Body() body: { refreshToken: string }
  ): Promise<{ data: { accessToken: string; refreshToken: string } }> {
    const tokens = await this.refreshTokenUseCase.execute(body.refreshToken)
    return { data: tokens }
  }

  @Post('auth/change-password')
  @ApiOperation({ summary: 'Change password', description: 'Change password for authenticated user' })
  @ApiBearerAuth('bearerAuth')
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: { example: { data: { message: 'Password changed successfully' } } }
  })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(@Body() dto: ChangePasswordDto): Promise<{ data: { message: string } }> {
    const payload: ChangePasswordPayload = {
      userId: dto.userId,
      currentPassword: dto.currentPassword,
      newPassword: dto.newPassword
    }

    await this.changePasswordUseCase.execute(payload)
    return { data: { message: 'Password changed successfully' } }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User updated', schema: { example: { data: { id: 'uuid' } } } })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param() params: IdParamDto, @Body() dto: UpdateUserDto): Promise<{ data: { id: string } }> {
    const payload: UpdateUserPayload = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
      city: dto.city,
      province: dto.province,
      country: dto.country,
      role: dto.role
    }

    await this.updateUserUseCase.execute(params.id, payload)
    return { data: { id: params.id } }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User deleted', schema: { example: { data: { id: 'uuid' } } } })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param() params: IdParamDto): Promise<{ data: { id: string } }> {
    await this.deleteUserUseCase.execute(params.id)
    return { data: { id: params.id } }
  }
}
