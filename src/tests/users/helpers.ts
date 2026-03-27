import type { User } from '../../core/users/domain/entities/user.entity'
import type { RegisterUserPayload } from '../../core/users/domain/types/payloads/register-user.payload'
import type { LoginUserPayload } from '../../core/users/domain/types/payloads/login-user.payload'
import type { UpdateUserPayload } from '../../core/users/domain/types/payloads/update-user.payload'
import type { HashProvider } from '../../core/shared/application/hash.provider'
import type { TokenProvider, TokenPayload, AuthTokens } from '../../core/shared/application/token.provider'
import type { EmailProvider, EmailPayload } from '../../core/shared/application/email.provider'

export const USER_FIXTURE: RegisterUserPayload = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'Test123@#.',
  phoneNumber: '1234567890',
  city: 'Test City',
  province: 'Test Province',
  country: 'Test Country',
  role: 'user'
}

export const USER_FIXTURE_2: RegisterUserPayload = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  password: 'Test123@#.',
  phoneNumber: '0987654321',
  city: 'Another City',
  province: 'Another Province',
  country: 'Test Country',
  role: 'admin'
}

export const LOGIN_FIXTURE: LoginUserPayload = {
  email: 'john.doe@example.com',
  password: 'Test123@#.'
}

export const UPDATE_FIXTURE: UpdateUserPayload = {
  firstName: 'Johnny',
  city: 'New City'
}

let userIdCounter = 0

export function createMockUser(overrides: Partial<User> = {}): User {
  const id = overrides.id ?? `mock-user-${++userIdCounter}`
  return {
    id,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'hashedpassword',
    phoneNumber: '1234567890',
    city: 'Test City',
    province: 'Test Province',
    country: 'Test Country',
    role: 'user',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    ...overrides
  }
}

export function resetUserIdCounter(): void {
  userIdCounter = 0
}

export class MockUserRepository {
  private readonly users = new Map<string, User>()
  private readonly emailIndex = new Map<string, string>()

  async list(offset: number, limit: number): Promise<User[]> {
    return Array.from(this.users.values()).slice(offset, offset + limit)
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    const id = this.emailIndex.get(email)
    if (id == null) return null
    return this.users.get(id) ?? null
  }

  async save(user: User): Promise<User> {
    this.users.set(user.id, user)
    this.emailIndex.set(user.email, user.id)
    return user
  }

  async update(id: string, data: UpdateUserPayload): Promise<User | null> {
    const user = this.users.get(id)
    if (user == null) return null

    const updated: User = {
      ...user,
      ...data,
      updatedAt: new Date()
    }
    this.users.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    const user = this.users.get(id)
    if (user != null) {
      this.emailIndex.delete(user.email)
      this.users.delete(id)
    }
  }

  clear(): void {
    this.users.clear()
    this.emailIndex.clear()
  }

  get size(): number {
    return this.users.size
  }
}

export class MockHashProvider implements HashProvider {
  async hash(value: string): Promise<string> {
    return `hashed_${value}`
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return hash === `hashed_${value}`
  }
}

export class MockTokenProvider implements TokenProvider {
  generateToken(payload: TokenPayload): AuthTokens {
    return {
      accessToken: `access_token_${payload.sub}_${payload.email}_${payload.role}`,
      refreshToken: `refresh_token_${payload.sub}_${payload.email}_${payload.role}`
    }
  }

  verifyAccessToken(token: string): Record<string, unknown> | null {
    if (token.startsWith('access_token_')) {
      const parts = token.split('_')
      return {
        sub: parts[2],
        email: parts[3],
        role: parts[4],
        type: 'access'
      }
    }
    return null
  }

  verifyRefreshToken(token: string): Record<string, unknown> | null {
    if (token.startsWith('refresh_token_')) {
      const parts = token.split('_')
      return {
        sub: parts[2],
        email: parts[3],
        role: parts[4],
        type: 'refresh'
      }
    }
    return null
  }
}

export class MockAuthService {
  tokenProvider: MockTokenProvider

  constructor() {
    this.tokenProvider = new MockTokenProvider()
  }

  generateTokens(payload: TokenPayload): AuthTokens {
    return {
      accessToken: `access_token_${payload.sub}_${payload.email}_${payload.role}`,
      refreshToken: `refresh_token_${payload.sub}_${payload.email}_${payload.role}`
    }
  }

  verifyAccessToken(token: string): Record<string, unknown> | null {
    if (token.startsWith('access_token_')) {
      const parts = token.split('_')
      return {
        sub: parts[2],
        email: parts[3],
        role: parts[4],
        type: 'access'
      }
    }
    return null
  }

  verifyRefreshToken(token: string): Record<string, unknown> | null {
    if (token.startsWith('refresh_token_')) {
      const parts = token.split('_')
      return {
        sub: parts[2],
        email: parts[3],
        role: parts[4],
        type: 'refresh'
      }
    }
    return null
  }
}

export class MockEmailProvider implements EmailProvider {
  readonly sentEmails: EmailPayload[] = []

  async sendEmail(payload: EmailPayload): Promise<void> {
    this.sentEmails.push(payload)
  }

  clear(): void {
    this.sentEmails.length = 0
  }
}
