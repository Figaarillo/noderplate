import type { ZodError, ZodIssue } from 'zod'

export interface FieldError {
  field: string
  message: string
}

export interface ValidationErrorResponse {
  success: boolean
  error: string
  details: FieldError[]
}

export const ZOD_ERROR_MESSAGES: Record<string, string> = {
  required: 'Este campo es requerido',
  invalid_type: 'Tipo de dato inválido',
  invalid_string: 'Formato inválido',
  invalid_email: 'Debe ser un email válido',
  invalid_uuid: 'Debe ser un UUID válido',
  too_small: 'El valor es demasiado pequeño',
  too_big: 'El valor es demasiado grande',
  string_too_short: 'La cadena es muy corta',
  string_too_long: 'La cadena es muy larga',
  invalid_regex: 'El formato no es válido',
  custom: 'Validación fallida'
}

function translateZodIssue(issue: ZodIssue): FieldError {
  const path = issue.path.join('.') || 'body'

  let message: string

  switch (issue.code) {
    case 'invalid_type':
      if (issue.message && issue.message.toLowerCase() === 'required') {
        message = ZOD_ERROR_MESSAGES.required
      } else if (issue.received === 'undefined' || issue.received === 'null') {
        message = ZOD_ERROR_MESSAGES.required
      } else if (issue.expected === 'string') {
        message = ZOD_ERROR_MESSAGES.invalid_string
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`
      }
      break

    case 'invalid_string':
      if (issue.validation === 'email') {
        message = ZOD_ERROR_MESSAGES.invalid_email
      } else if (issue.validation === 'uuid') {
        message = ZOD_ERROR_MESSAGES.invalid_uuid
      } else if (issue.validation === 'regex') {
        message = issue.message || ZOD_ERROR_MESSAGES.invalid_regex
      } else {
        message = issue.message || ZOD_ERROR_MESSAGES.invalid_string
      }
      break

    case 'too_small':
      if (issue.type === 'string') {
        message = `Debe tener al menos ${issue.minimum} caracteres`
      } else {
        message = `El valor debe ser al menos ${issue.minimum}`
      }
      break

    case 'too_big':
      if (issue.type === 'string') {
        message = `Debe tener como máximo ${issue.maximum} caracteres`
      } else {
        message = `El valor debe ser como máximo ${issue.maximum}`
      }
      break

    case 'invalid_union':
      message = 'Valor no válido'
      break

    case 'custom':
      message = issue.message || ZOD_ERROR_MESSAGES.custom
      break

    default:
      message = issue.message
  }

  return { field: path, message }
}

export function formatZodErrors(error: ZodError): ValidationErrorResponse {
  const details = error.issues.map(translateZodIssue)

  const summary = details.map(d => `${d.field}: ${d.message}`).join(', ')

  return {
    success: false,
    error: summary,
    details
  }
}

export class SchemaValidationException extends Error {
  readonly details: FieldError[]
  readonly response: ValidationErrorResponse

  constructor(error: ZodError) {
    const formatted = formatZodErrors(error)
    super(formatted.error)
    this.name = 'SchemaValidationError'
    this.details = formatted.details
    this.response = formatted
  }
}

export function createSchemaValidationError(error: ZodError): ValidationErrorResponse {
  return formatZodErrors(error)
}
