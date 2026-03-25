import { z } from 'zod'

export const idDTO = z.string().uuid({ message: 'The format of ID must be a valid UUID' })

export const firstNameDTO = z
  .string()
  .min(2, { message: 'The firstName must be at least 2 characters long' })
  .max(100, { message: 'The length of firstName must be less than 100' })
  .regex(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/, { message: 'The firstName must not contain special characters' })
  .refine(firstName => firstName.trim().length > 0, { message: 'The firstName cannot be empty' })

export const lastNameDTO = z
  .string()
  .min(2, { message: 'The lastName must be at least 2 characters long' })
  .max(100, { message: 'The length of lastName must be less than 100' })
  .regex(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑüÜ]+$/, { message: 'The lastName must not contain special characters' })
  .refine(lastName => lastName.trim().length > 0, { message: 'The lastName cannot be empty' })

export const emailDTO = z
  .string()
  .email({ message: 'The email must be a valid email address' })
  .refine(email => email.trim().length > 0, { message: 'The email cannot be empty' })

export const passwordDTO = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/(?=.*\d)/, { message: 'Password must contain at least one digit' })
  .regex(/(?=.*[@$!%*?&])/, { message: 'Password must contain at least one special character' })

export const phoneNumberDTO = z
  .string()
  .regex(/^\d{10,15}$/, { message: 'Phone number must be between 10 and 15 digits' })
  .refine(phoneNumber => phoneNumber.trim().length > 0, { message: 'Phone number cannot be empty' })

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
