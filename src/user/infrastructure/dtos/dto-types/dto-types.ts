import { z } from 'zod'

export const idDTO = z.string().uuid({ message: 'The format of ID must be a valid UUID' })

export const firstNameDTO = z
  .string()
  .min(2, { message: 'The length of name must be greater than 2' })
  .max(50, { message: 'The length of name must be less than 50' })

export const lastNameDTO = z
  .string()
  .min(2, { message: 'The length of surname must be greater than 2' })
  .max(50, { message: 'The length of surname must be less than 50' })

export const phoneNumberDTO = z
  .string()
  .length(8, { message: 'The length of phone number must be 8' })
  .regex(/^\d+$/, { message: 'The phone number must contain only digits' })

export const emailDTO = z.string().email({ message: 'The format of email must be valid' })

export const passwordDTO = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/, {
    message:
      'Password must have at least one uppercase letter, one lowercase letter, one number, and one special character'
  })

export const cityDTO = z
  .string()
  .min(2, { message: 'City name must be at least 2 characters long' })
  .max(100, { message: 'City name must be less than 100 characters' })

export const provinceDTO = z
  .string()
  .min(2, { message: 'Province name must be at least 2 characters long' })
  .max(100, { message: 'Province name must be less than 100 characters' })

export const countryDTO = z
  .string()
  .min(2, { message: 'Country name must be at least 2 characters long' })
  .max(100, { message: 'Country name must be less than 100 characters' })

export const roleDTO = z
  .string()
  .min(2, { message: 'Role must be at least 2 characters long' })
  .max(50, { message: 'Role must be less than 50 characters' })
