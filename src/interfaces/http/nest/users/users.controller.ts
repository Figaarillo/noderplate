import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, Inject } from '@nestjs/common'
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ListUsersUseCase } from '../../../../core/users/application/use-cases/list.usecase'
import { FindByIdUseCase } from '../../../../core/users/application/use-cases/find-by-id.usecase'
import { FindByEmailUseCase } from '../../../../core/users/application/use-cases/find-by-email.usecase'
import { RegisterUserUseCase } from '../../../../core/users/application/use-cases/register.usecase'
import { UpdateUserUseCase } from '../../../../core/users/application/use-cases/update.usecase'
import { DeleteUserUseCase } from '../../../../core/users/application/use-cases/delete.usecase'
import type { RegisterUserPayload } from '../../../../core/users/domain/payloads/register-user.payload'
import type { UpdateUserPayload } from '../../../../core/users/domain/payloads/update-user.payload'
import { RegisterUserDto, UpdateUserDto, PaginationQueryDto, IdParamDto, EmailQueryDto } from './dto/user.dto'
import {
  LIST_USERS_USE_CASE,
  FIND_BY_ID_USE_CASE,
  FIND_BY_EMAIL_USE_CASE,
  REGISTER_USER_USE_CASE,
  UPDATE_USER_USE_CASE,
  DELETE_USER_USE_CASE
} from './users.providers'

@Controller('api/users')
export class UsersController {
  constructor(
    @Inject(LIST_USERS_USE_CASE) private readonly listUsersUseCase: ListUsersUseCase,
    @Inject(FIND_BY_ID_USE_CASE) private readonly findByIdUseCase: FindByIdUseCase,
    @Inject(FIND_BY_EMAIL_USE_CASE) private readonly findByEmailUseCase: FindByEmailUseCase,
    @Inject(REGISTER_USER_USE_CASE) private readonly registerUserUseCase: RegisterUserUseCase,
    @Inject(UPDATE_USER_USE_CASE) private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject(DELETE_USER_USE_CASE) private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  @Get()
  async list(@Query() query: PaginationQueryDto): Promise<{ data: unknown[] }> {
    const offset = query.offset ?? 0
    const limit = query.limit ?? 10

    const users = await this.listUsersUseCase.execute(offset, limit)
    return { data: users }
  }

  @Get(':id')
  async findById(@Param() params: IdParamDto): Promise<{ data: unknown }> {
    const user = await this.findByIdUseCase.execute(params.id)
    return { data: user }
  }

  @Get('email')
  async findByEmail(@Query() query: EmailQueryDto): Promise<{ data: unknown }> {
    const user = await this.findByEmailUseCase.execute(query.email)
    return { data: user }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto): Promise<{ data: { id: string } }> {
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

    const user = await this.registerUserUseCase.execute(payload)
    return { data: { id: user.id } }
  }

  @Put(':id')
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
  async delete(@Param() params: IdParamDto): Promise<{ data: { id: string } }> {
    await this.deleteUserUseCase.execute(params.id)
    return { data: { id: params.id } }
  }
}
