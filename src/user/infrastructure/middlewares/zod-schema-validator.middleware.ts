import type UserPayload from '@user/domain/payloads/user.payload'
import { type ZodType, ZodError } from 'zod'

class SchemaValidator<T> {
  private readonly schema: ZodType<T>
  private readonly payload: Partial<UserPayload>

  constructor(schema: ZodType<T>, payload: Partial<UserPayload>) {
    this.schema = schema
    this.payload = payload
  }

  exec(): T {
    try {
      return this.schema.parse(this.payload)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(error.errors.map(err => err.message).join('\n'))
      }

      throw error
    }
  }
}

export default SchemaValidator
