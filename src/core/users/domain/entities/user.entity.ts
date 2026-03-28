import type { RegisterUserPayload } from '../types/payloads/register-user.payload'
import { UserStatus, UserStateMachine } from '../user-status'

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
  status: UserStatus
  isEmailVerified: boolean
  verificationCode: string | null
  verificationExp: Date | null
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
      status: UserStateMachine.initialStatus(),
      isEmailVerified: false,
      verificationCode: null,
      verificationExp: null,
      createdAt: now,
      updatedAt: now
    }
    return new UserEntity(user)
  }

  static fromPersistence(user: User): UserEntity {
    return new UserEntity(user)
  }

  setVerificationCode(code: string, expiresInMinutes: number = 15): void {
    this.user.verificationCode = code
    this.user.verificationExp = new Date(Date.now() + expiresInMinutes * 60 * 1000)
  }

  verifyEmail(code: string): boolean {
    if (this.user.verificationCode !== code) {
      return false
    }
    if (this.user.verificationExp && new Date() > this.user.verificationExp) {
      return false
    }
    this.user.isEmailVerified = true
    this.user.verificationCode = null
    this.user.verificationExp = null
    this.user.status = UserStatus.VERIFIED
    return true
  }

  isVerified(): boolean {
    return UserStateMachine.isVerified(this.user.status as UserStatus)
  }

  canLogin(): boolean {
    return this.user.isEmailVerified && this.user.status === UserStatus.VERIFIED
  }

  toPrimitive(): User {
    return { ...this.user }
  }
}
