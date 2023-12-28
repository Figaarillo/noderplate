import type ErrorMessage from '@shared/domain/types/error-messages'

const ErrorMessages: ErrorMessage = {
  USER_NOT_FOUND: {
    message: 'User not found',
    statusCode: 404
  },
  USER_ALREADY_EXISTS: {
    message: 'User already exists',
    statusCode: 409
  }
}

export default ErrorMessages
