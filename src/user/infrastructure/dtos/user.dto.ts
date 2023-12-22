import { z } from 'zod'
import { emailDTO, firstNameDTO, lastNameDTO, passwordDTO, phoneNumberDTO } from './dto-types/dto-types'

const UsreDTO = z.object({
  firstName: firstNameDTO,
  lastName: lastNameDTO,
  phoneNumber: phoneNumberDTO,
  email: emailDTO,
  password: passwordDTO
})

export type UserDTO = z.infer<typeof UsreDTO>

export default UsreDTO
