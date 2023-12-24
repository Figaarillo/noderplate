import { z } from 'zod'
import { emailDTO, firstNameDTO, idDTO, lastNameDTO, passwordDTO, phoneNumberDTO } from './dto-types/dto-types'

const UpdateUserDTO = z.object({
  id: idDTO,
  firstName: firstNameDTO,
  lastName: lastNameDTO,
  phoneNumber: phoneNumberDTO,
  email: emailDTO,
  password: passwordDTO
})

export default UpdateUserDTO
