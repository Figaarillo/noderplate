import { UserEntity } from '../../domain/entities/user.entity'
import { CannotSaveUserError } from '../../domain/errors/cannot-save-user.error'
import type { UserRepository } from '../../domain/repositories/user.repository'
import type { RegisterUserPayload } from '../../domain/types/payloads/register-user.payload'
import type { HashProvider } from '../../../shared/application/hash.provider'
import type { TokenProvider } from '../../../shared/application/token.provider'
import type { AuthTokens } from './login.usecase'

export class RegisterUserUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly tokenProvider: TokenProvider
  ) {}

  async execute(
    payload: RegisterUserPayload
  ): Promise<{ user: ReturnType<UserEntity['toPrimitive']>; tokens: AuthTokens }> {
    const existingUser = await this.repository.findByEmail(payload.email)
    if (existingUser != null) {
      throw new CannotSaveUserError('User already exists')
    }

    const hashedPassword = await this.hashProvider.hash(payload.password)
    const userEntity = UserEntity.create(payload, hashedPassword)
    const user = userEntity.toPrimitive()

    const savedUser = await this.repository.save(user)
    if (savedUser == null) {
      throw new CannotSaveUserError()
    }

    const tokens = this.generateTokens(savedUser)

    return { user: savedUser, tokens }
  }

  private generateTokens(user: ReturnType<UserEntity['toPrimitive']>): AuthTokens {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    }

    const accessToken = this.tokenProvider.generateToken({
      ...payload,
      type: 'access'
    })

    const refreshToken = this.tokenProvider.generateRefreshToken({
      ...payload,
      type: 'refresh'
    })

    return { accessToken, refreshToken }
  }
}
