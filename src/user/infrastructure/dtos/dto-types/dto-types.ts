import { z } from 'zod'

export const idDTO = z
  .string()
  .refine(value => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value), {
    message: 'The format of _id must be uuid'
  })

export const firstNameDTO = z
  .string()
  .min(2, {
    message: 'The length of name must be greater than 2'
  })
  .max(20, {
    message: 'The length of name must be less than 20'
  })

export const lastNameDTO = z
  .string()
  .min(2, {
    message: 'The length of surname must be greater than 2'
  })
  .max(50, {
    message: 'The length of surname must be less than 50'
  })

export const phoneNumberDTO = z
  .number()
  .min(10000000, {
    message: 'The length of phone number must be 8'
  })
  .max(99999999, {
    message: 'The length of phone number must be 8'
  })

export const emailDTO = z.string().email({
  message: 'The format of email must be email'
})

export const passwordDTO = z.string().refine(value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,25}$/.test(value), {
  message:
    'The format of password must have 10 to 25 characters. Must have at least one uppercase letter, one lowercase letter, one number and one special character'
})
