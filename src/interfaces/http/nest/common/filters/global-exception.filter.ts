import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common'
import type { Response } from 'express'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'
    let error = 'Internal Server Error'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as Record<string, unknown>
        message = (res.message as string) ?? exception.message
        error = (res.error as string) ?? 'Error'
      } else {
        message = exception.message
      }
    } else if (exception instanceof Error) {
      if (exception.name === 'InvalidCredentialsError') {
        status = HttpStatus.UNAUTHORIZED
        message = exception.message || 'Invalid credentials'
        error = 'Unauthorized'
      } else if (exception.name === 'NotFoundError' || exception.message.includes('not found')) {
        status = HttpStatus.NOT_FOUND
        message = exception.message || 'Resource not found'
        error = 'Not Found'
      } else if (exception.name === 'ValidationError') {
        status = HttpStatus.BAD_REQUEST
        message = exception.message || 'Validation error'
        error = 'Bad Request'
      } else {
        this.logger.error(`Unhandled error: ${exception.message}`, exception.stack)
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      error
    })
  }
}
