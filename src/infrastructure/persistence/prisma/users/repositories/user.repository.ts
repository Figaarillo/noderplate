import type { User } from '../../../../../core/users/domain/entities/user.entity'
import type { UpdateUserPayload } from '../../../../../core/users/domain/types/payloads/update-user.payload'
import type { UserRepository } from '../../../../../core/users/domain/repositories/user.repository'
import { prisma } from '../../shared/client'

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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
    return this.mapToDomain(created)
  }

  async update(id: string, data: UpdateUserPayload): Promise<User | null> {
    try {
      const updated = await prisma.user.update({
        where: { id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          city: data.city,
          province: data.province,
          country: data.country,
          role: data.role
        }
      })
      return this.mapToDomain(updated)
    } catch {
      return null
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } }).catch(() => {})
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
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt
    }
  }
}
