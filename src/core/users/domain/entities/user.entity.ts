import type { RegisterUserPayload } from '../types/payloads/register-user.payload'

export interface User {
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
}

export class UserEntity {
  private readonly user: User

  private constructor(user: User) {
    this.user = user
  }

  static create(payload: RegisterUserPayload, hashedPassword: string): UserEntity {
    const now = new Date()
    const user: User = {
      id: crypto.randomUUID(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: hashedPassword,
      phoneNumber: payload.phoneNumber,
      city: payload.city,
      province: payload.province,
      country: payload.country,
      role: payload.role ?? 'user',
      createdAt: now,
      updatedAt: now
    }
    return new UserEntity(user)
  }

  static fromPersistence(user: User): UserEntity {
    return new UserEntity(user)
  }

  toPrimitive(): User {
    return { ...this.user }
  }
}
