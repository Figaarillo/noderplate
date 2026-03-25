import { z } from 'zod'
import {
  firstNameDTO,
  lastNameDTO,
  emailDTO,
  passwordDTO,
  phoneNumberDTO,
  cityDTO,
  provinceDTO,
  countryDTO,
  roleDTO
} from '../../shared/dto-types/user.dto-types'

export const RegisterUserDTO = z.object({
  firstName: firstNameDTO,
  lastName: lastNameDTO,
  email: emailDTO,
  password: passwordDTO,
  phoneNumber: phoneNumberDTO,
  city: cityDTO,
  province: provinceDTO,
  country: countryDTO,
  role: roleDTO.optional()
})

export const LoginUserDTO = z.object({
  email: emailDTO,
  password: z.string().min(1, { message: 'Password is required' })
})

export const UpdateUserDTO = z.object({
  firstName: firstNameDTO.optional(),
  lastName: lastNameDTO.optional(),
  phoneNumber: phoneNumberDTO.optional(),
  city: cityDTO.optional(),
  province: provinceDTO.optional(),
  country: countryDTO.optional(),
  role: roleDTO.optional()
})

export const CheckIdDTO = z.object({
  id: z.string().uuid({ message: 'The format of ID must be a valid UUID' })
})
