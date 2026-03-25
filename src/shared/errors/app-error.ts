export class ApplicationError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly httpStatus: number = 500
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 422)
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404)
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message: string) {
    super(message, 'UNAUTHORIZED', 401)
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message: string) {
    super(message, 'FORBIDDEN', 403)
  }
}
