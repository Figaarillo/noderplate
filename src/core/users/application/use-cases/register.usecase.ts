import { UserEntity } from '../../domain/entities/user.entity'
import { CannotSaveUserError } from '../../domain/errors/cannot-save-user.error'
import type { UserRepository } from '../../domain/repositories/user.repository'
import type { RegisterUserPayload } from '../../domain/types/payloads/register-user.payload'
import type { HashProvider } from '../../../shared/application/hash.provider'
import type { EmailProvider } from '../../../shared/application/email.provider'

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export interface RegisterUserResult {
  user: ReturnType<UserEntity['toPrimitive']>
  verificationCode: string
  verificationUrl: string
}

export class RegisterUserUseCase {
  constructor(
    private readonly repository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly emailProvider: EmailProvider
  ) {}

  async execute(payload: RegisterUserPayload, redirectUrl?: string): Promise<RegisterUserResult> {
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
    const verificationCode = generateVerificationCode()
    userEntity.setVerificationCode(verificationCode)

    const user = userEntity.toPrimitive()

    const savedUser = await this.repository.save(user)
    if (savedUser == null) {
      throw new CannotSaveUserError()
    }

    const baseUrl = redirectUrl ?? process.env.APP_URL ?? 'http://localhost:8080'
    const verificationUrl = `${baseUrl}/verify-email?email=${encodeURIComponent(savedUser.email)}`

    await this.emailProvider.sendEmail({
      to: savedUser.email,
      subject: 'Verifica tu cuenta',
      html: `
        <h1>Verificación de cuenta</h1>
        <p>Para verificar tu cuenta, ingresa el código de 6 dígitos en la página de verificación.</p>
        <p>Tu código es: <strong>${verificationCode}</strong></p>
        <p>Haz clic en el siguiente enlace para verificar:</p>
        <p><a href="${verificationUrl}">Verificar mi cuenta</a></p>
        <p>Este código expira en 15 minutos.</p>
      `
    })

    return { user: savedUser, verificationCode, verificationUrl }
  }
}
