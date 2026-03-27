import { UserEntity } from '../../domain/entities/user.entity'
import { CannotSaveUserError } from '../../domain/errors/cannot-save-user.error'
import type { UserRepository } from '../../domain/repositories/user.repository'
import type { RegisterUserPayload } from '../../domain/types/payloads/register-user.payload'
import type { HashProvider } from '../../../shared/application/hash.provider'
import type { AuthService, AuthTokens } from '../../../auth/application/services/auth.service'

export class RegisterUserUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly authService: AuthService
  ) {}

  async execute(
    payload: RegisterUserPayload
  ): Promise<{ user: ReturnType<UserEntity['toPrimitive']>; tokens: AuthTokens }> {
    const existingUser = await this.repository.findByEmail(payload.email)
    if (existingUser != null) {
      throw new CannotSaveUserError('User already exists')
    }

    const hashedPassword = await this.hashProvider.hash(payload.password)

    const registerPayload = {
      ...payload,
      role: 'user'
    }

    const userEntity = UserEntity.create(registerPayload, hashedPassword)
    const user = userEntity.toPrimitive()

    const savedUser = await this.repository.save(user)
    if (savedUser == null) {
      throw new CannotSaveUserError()
    }

    const tokens = this.authService.generateTokens({
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role
    })

    return { user: savedUser, tokens }
  }
}
