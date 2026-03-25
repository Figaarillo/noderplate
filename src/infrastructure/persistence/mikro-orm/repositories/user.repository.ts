import type { EntityManager } from '@mikro-orm/core'
import type { User, UpdateUserInput } from '@core/users/domain/entities/user.entity'
import type { UserRepository } from '@core/users/domain/repositories/user.repository'
import { UserMikroORM } from '../entities/user.entity'

export class MikroORMUserRepository implements UserRepository {
  constructor(private readonly em: EntityManager) {}

  async list(offset: number, limit: number): Promise<User[]> {
    const users = await this.em.find(UserMikroORM, {}, { offset, limit })
    return users.map(user => this.mapToDomain(user))
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.em.findOne(UserMikroORM, { id })
    if (user == null) {
      return null
    }
    return this.mapToDomain(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.em.findOne(UserMikroORM, { email })
    if (user == null) {
      return null
    }
    return this.mapToDomain(user)
  }

  async save(user: User): Promise<User> {
    const userORM = this.mapToORM(user)
    await this.em.persistAndFlush(userORM)
    return this.mapToDomain(userORM)
  }

  async update(id: string, data: UpdateUserInput): Promise<User | null> {
    const user = await this.em.findOne(UserMikroORM, { id })
    if (user == null) {
      return null
    }

    Object.assign(user, data)
    user.updatedAt = new Date()
    await this.em.flush()

    return this.mapToDomain(user)
  }

  async delete(id: string): Promise<void> {
    const user = await this.em.findOne(UserMikroORM, { id })
    if (user != null) {
      await this.em.removeAndFlush(user)
    }
  }

  private mapToDomain(orm: UserMikroORM): User {
    return {
      id: orm.id,
      firstName: orm.firstName,
      lastName: orm.lastName,
      email: orm.email,
      password: orm.password,
      phoneNumber: orm.phoneNumber,
      city: orm.city,
      province: orm.province,
      country: orm.country,
      role: orm.role,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt
    }
  }

  private mapToORM(user: User): UserMikroORM {
    const orm = new UserMikroORM()
    orm.id = user.id
    orm.firstName = user.firstName
    orm.lastName = user.lastName
    orm.email = user.email
    orm.password = user.password
    orm.phoneNumber = user.phoneNumber
    orm.city = user.city
    orm.province = user.province
    orm.country = user.country
    orm.role = user.role
    orm.createdAt = user.createdAt
    orm.updatedAt = user.updatedAt
    return orm
  }
}
