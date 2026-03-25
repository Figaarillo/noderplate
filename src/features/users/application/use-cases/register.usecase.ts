import type { User } from '../../domain/entities/user.entity'
import { CannotSaveUserError } from '../../domain/errors/cannot-save-user.error'
import type { UserRepository } from '../../domain/repositories/user.repository'
import type { RegisterUserPayload } from '../../domain/payloads/register-user.payload'

export class RegisterUserUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(payload: RegisterUserPayload): Promise<User> {
    const existingUser = await this.repository.findByEmail(payload.email)
    if (existingUser != null) {
      throw new CannotSaveUserError('User already exists')
    }

    const user: User = {
      id: crypto.randomUUID(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
      phoneNumber: payload.phoneNumber,
      city: payload.city,
      province: payload.province,
      country: payload.country,
      role: payload.role ?? 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const savedUser = await this.repository.save(user)
    if (savedUser == null) {
      throw new CannotSaveUserError()
    }

    return savedUser
  }
}
