import type { UserRepository } from '../../domain/repositories/user.repository'
import { UserStatus } from '../../domain/user-status'

export class VerifyEmailUseCase {
  constructor(private readonly repository: UserRepository) {}

  async execute(email: string, code: string): Promise<{ success: boolean; message: string }> {
    const user = await this.repository.findByEmail(email)
    if (user == null) {
      return { success: false, message: 'Usuario no encontrado' }
    }

    if (user.isEmailVerified) {
      return { success: true, message: 'El email ya está verificado' }
    }

    if (user.verificationCode !== code) {
      return { success: false, message: 'Código de verificación inválido' }
    }

    if (user.verificationExp && new Date() > user.verificationExp) {
      return { success: false, message: 'El código de verificación ha expirado' }
    }

    await this.repository.updateVerification(user.id, true, UserStatus.VERIFIED, null, null)

    return { success: true, message: 'Email verificado correctamente' }
  }
}
