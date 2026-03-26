import { ZodError, type ZodType } from 'zod'

export class SchemaValidationError extends Error {
  readonly code: number = 400

  constructor(
    message?: string,
    public readonly details?: Record<string, string[]>
  ) {
    super(message ?? 'Validation errors occurred')
    this.name = 'SchemaValidationError'
  }
}

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
        const details = this.formatErrors(error.errors)
        throw new SchemaValidationError(error.errors.map(e => e.message).join(', '), details)
      }
      throw error
    }
  }

  private formatErrors(errors: Array<{ path: Array<string | number>; message: string }>): Record<string, string[]> {
    const formatted: Record<string, string[]> = {}
    for (const error of errors) {
      const key = error.path.join('.')
      if (key === '') {
        if (formatted.root === undefined) {
          formatted.root = []
        }
        formatted.root.push(error.message)
      } else {
        if (formatted[key] === undefined) {
          formatted[key] = []
        }
        formatted[key].push(error.message)
      }
    }
    return formatted
  }
}
