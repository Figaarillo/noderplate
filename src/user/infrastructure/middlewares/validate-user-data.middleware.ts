import type UserPayload from '@user/domain/payloads/user.payload'
import UserDTO, { type UserTypeDTO } from '../dtos/user.dto'
import { ZodError } from 'zod'

class ValidateUserData {
  constructor(payload: UserPayload) {
    this.validate(payload)
  }

  validate(payload: UserPayload): UserTypeDTO {
    try {
      return UserDTO.parse(payload)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(error.errors.map(err => err.message).join('\n'))
      }

      throw error
    }
  }
}

export default ValidateUserData
