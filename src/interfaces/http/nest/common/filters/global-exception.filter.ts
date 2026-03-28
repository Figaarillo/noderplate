import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { Catch, HttpException, HttpStatus, Logger, BadRequestException } from '@nestjs/common'
import type { Response } from 'express'

interface ValidationError {
  field: string
  message: string
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'
    let details: ValidationError[] | undefined

    if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST
      const exceptionResponse = exception.getResponse()
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as Record<string, unknown>
        const messages = res.message
        if (Array.isArray(messages)) {
          details = this.formatValidationErrors(messages)
          message = details.map(d => `${d.field}: ${d.message}`).join(', ')
        } else {
          message = (messages as string) ?? exception.message
        }
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as Record<string, unknown>
        message = (res.message as string) ?? exception.message
      } else {
        message = exception.message
      }
    } else if (exception instanceof Error) {
      if (exception.name === 'InvalidCredentialsError') {
        status = HttpStatus.UNAUTHORIZED
        message = exception.message || 'Invalid credentials'
      } else if (exception.name === 'NotFoundError' || exception.message.includes('not found')) {
        status = HttpStatus.NOT_FOUND
        message = exception.message || 'Resource not found'
      } else if (exception.name === 'ValidationError') {
        status = HttpStatus.BAD_REQUEST
        message = exception.message || 'Validation error'
      } else {
        this.logger.error(`Unhandled error: ${exception.message}`, exception.stack)
      }
    }

    const responseBody: Record<string, unknown> = {
      statusCode: status,
      success: status < 400,
      error: message
    }

    if (details) {
      responseBody.success = false
      responseBody.details = details
    }

    response.status(status).json(responseBody)
  }

  private formatValidationErrors(messages: unknown[]): ValidationError[] {
    const errors: ValidationError[] = []

    for (const msg of messages) {
      if (typeof msg === 'string') {
        const fieldMatch = msg.match(/^(\w+)\.?(.*)$/)
        if (fieldMatch) {
          const field = fieldMatch[1] || 'body'
          const errorMsg = fieldMatch[2]?.trim() || msg
          errors.push({
            field,
            message: this.translateErrorMessage(errorMsg)
          })
        }
      } else if (typeof msg === 'object' && msg !== null) {
        const err = msg as Record<string, unknown>
        const field = (err.property as string) || 'unknown'
        const constraints = err.constraints as Record<string, string> | undefined
        if (constraints) {
          for (const constraint of Object.values(constraints)) {
            errors.push({
              field,
              message: this.translateErrorMessage(constraint)
            })
          }
        }
      }
    }

    return errors
  }

  private translateErrorMessage(message: string): string {
    const translations: Record<string, string> = {
      'should be a valid email': 'Debe ser un email válido',
      'is not a valid email': 'Debe ser un email válido',
      'must be a string': 'Debe ser una cadena de texto',
      'must be a valid UUID': 'Debe ser un UUID válido',
      'is not valid': 'No es válido',
      'should not be empty': 'Este campo es requerido',
      'must not be empty': 'Este campo es requerido',
      'is required': 'Este campo es requerido',
      'must be longer than or equal to': 'Debe tener al menos',
      'must be shorter than or equal to': 'Debe tener como máximo',
      'must contain at least one uppercase letter': 'Debe contener al menos una letra mayúscula',
      'must contain at least one lowercase letter': 'Debe contener al menos una letra minúscula',
      'must contain at least one special character': 'Debe contener al menos un carácter especial',
      'must contain at least one digit': 'Debe contener al menos un dígito'
    }

    const lower = message.toLowerCase()
    for (const [key, value] of Object.entries(translations)) {
      if (lower.includes(key.toLowerCase())) {
        return value
      }
    }

    return message
  }
}
