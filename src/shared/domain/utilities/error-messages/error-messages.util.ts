import type ErrorMessage from '@shared/domain/types/error-messages'

const ErrorMessages: ErrorMessage = {
  UNEXPECTED_ERROR: {
    message: 'Unexpected error',
    statusCode: 500
  }
}

export default ErrorMessages
