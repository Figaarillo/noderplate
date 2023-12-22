import { z } from 'zod'
import { emailDTO, firstNameDTO, lastNameDTO, passwordDTO, phoneNumberDTO } from './dto-types/dto-types'

const UserDTO = z.object({
  firstName: firstNameDTO,
  lastName: lastNameDTO,
  phoneNumber: phoneNumberDTO,
  email: emailDTO,
  password: passwordDTO
})

export type UserTypeDTO = z.infer<typeof UserDTO>

export default UserDTO
