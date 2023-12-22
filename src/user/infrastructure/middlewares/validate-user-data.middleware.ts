import type UserPayload from '@user/domain/payloads/user.payload'
import UserDTO, { type UserTypeDTO } from '../dtos/user.dto'
import { ZodError } from 'zod'

class ValidateUserData {
  readonly payload: UserPayload

  constructor(payload: UserPayload) {
    this.payload = payload
  }

  validate(): UserTypeDTO {
    try {
      return UserDTO.parse(this.payload)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(error.errors.map(err => err.message).join('\n'))
      }

      throw error
    }
  }
}

export default ValidateUserData
