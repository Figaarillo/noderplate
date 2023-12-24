import { z } from 'zod'
import { emailDTO, firstNameDTO, lastNameDTO, passwordDTO, phoneNumberDTO } from './dto-types/dto-types'

const RegisterUserDTO = z.object({
  firstName: firstNameDTO,
  lastName: lastNameDTO,
  phoneNumber: phoneNumberDTO,
  email: emailDTO,
  password: passwordDTO
})

export default RegisterUserDTO
