import UserSchemaValidationError from '@user/domain/exceptions/user-schema-validation.error'
import type IUpdateUserData from '@user/domain/interfaces/update-user-data.interface'
import type IUserPrimitiveData from '@user/domain/interfaces/user-primitive-data.interface'
import { ZodError, type ZodType } from 'zod'

class SchemaValidator<T> {
  private readonly schema: ZodType<T>
  private readonly payload: Partial<IUserPrimitiveData>

  constructor(schema: ZodType<T>, payload: Partial<IUpdateUserData>) {
    this.schema = schema
    this.payload = payload
  }

  exec(): T {
    try {
      return this.schema.parse(this.payload)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new UserSchemaValidationError(error.errors.map(err => err.message).join('\n'))
      }

      throw error
    }
  }
}

export default SchemaValidator
