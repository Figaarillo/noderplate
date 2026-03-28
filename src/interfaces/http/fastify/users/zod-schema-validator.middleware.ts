import { ZodError, type ZodType } from 'zod'
import { SchemaValidationException, type FieldError, type ValidationErrorResponse } from '../shared/zod-error-map'

export class SchemaValidator {
  constructor(
    private readonly schema: ZodType<unknown>,
    private readonly payload: unknown
  ) {}

  validate(): unknown {
    try {
      return this.schema.parse(this.payload)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new SchemaValidationException(error)
      }
      throw error
    }
  }
}

export { SchemaValidationException, type FieldError, type ValidationErrorResponse }
