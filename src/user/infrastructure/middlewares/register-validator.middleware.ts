import type UserPayload from '@user/domain/payloads/user.payload'
import { ZodError } from 'zod'
import RegisterUserDTO, { type UserTypeDTO } from '../dtos/register-user.dto'

class RegisterValidator {
  readonly payload: UserPayload

  constructor(payload: UserPayload) {
    this.payload = payload
  }

  exec(): UserTypeDTO {
    try {
      return RegisterUserDTO.parse(this.payload)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(error.errors.map(err => err.message).join('\n'))
      }

      throw error
    }
  }
}

export default RegisterValidator
