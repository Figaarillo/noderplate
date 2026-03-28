import type { User } from '../../../../../core/users/domain/entities/user.entity'
import type { UpdateUserPayload } from '../../../../../core/users/domain/types/payloads/update-user.payload'
import type { UserRepository } from '../../../../../core/users/domain/repositories/user.repository'
import { prisma } from '../../shared/client'
import { UserNotFoundError, UserUpdateError, UserDeleteError } from './user-errors'
import { Prisma } from '@prisma/client'

export class PrismaUserRepository implements UserRepository {
  async list(offset: number, limit: number): Promise<User[]> {
    const users = await prisma.user.findMany({
      skip: offset,
      take: limit
    })
    return users.map(u => this.mapToDomain(u))
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } })
    return user ? this.mapToDomain(user) : null
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    return user ? this.mapToDomain(user) : null
  }

  async save(user: User): Promise<User> {
    const created = await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        phoneNumber: user.phoneNumber,
        city: user.city,
        province: user.province,
        country: user.country,
        role: user.role,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
        verificationCode: user.verificationCode,
        verificationExp: user.verificationExp,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
    return this.mapToDomain(created)
  }

  async update(id: string, data: UpdateUserPayload): Promise<User> {
    try {
      const updateData: Record<string, unknown> = {}
      if (data.firstName !== undefined) updateData.firstName = data.firstName
      if (data.lastName !== undefined) updateData.lastName = data.lastName
      if (data.phoneNumber !== undefined) updateData.phoneNumber = data.phoneNumber
      if (data.city !== undefined) updateData.city = data.city
      if (data.province !== undefined) updateData.province = data.province
      if (data.country !== undefined) updateData.country = data.country
      if (data.role !== undefined) updateData.role = data.role

      const updated = await prisma.user.update({
        where: { id },
        data: updateData
      })
      return this.mapToDomain(updated)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new UserNotFoundError(`User with id ${id} not found`)
      }
      throw new UserUpdateError('Failed to update user')
    }
  }

  async updateVerification(
    id: string,
    isEmailVerified: boolean,
    status: string,
    verificationCode?: string | null,
    verificationExp?: Date | null
  ): Promise<User> {
    try {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          isEmailVerified,
          status,
          verificationCode,
          verificationExp
        }
      })
      return this.mapToDomain(updated)
    } catch (error) {
      throw new UserUpdateError('Failed to update verification')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.user.delete({ where: { id } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new UserNotFoundError(`User with id ${id} not found`)
      }
      throw new UserDeleteError('Failed to delete user')
    }
  }

  private mapToDomain(prismaUser: {
    id: string
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber: string
    city: string
    province: string
    country: string
    role: string
    status: string
    isEmailVerified: boolean
    verificationCode: string | null
    verificationExp: Date | null
    createdAt: Date
    updatedAt: Date
  }): User {
    return {
      id: prismaUser.id,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      email: prismaUser.email,
      password: prismaUser.password,
      phoneNumber: prismaUser.phoneNumber,
      city: prismaUser.city,
      province: prismaUser.province,
      country: prismaUser.country,
      role: prismaUser.role,
      status: prismaUser.status as User['status'],
      isEmailVerified: prismaUser.isEmailVerified,
      verificationCode: prismaUser.verificationCode,
      verificationExp: prismaUser.verificationExp,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt
    }
  }
}
