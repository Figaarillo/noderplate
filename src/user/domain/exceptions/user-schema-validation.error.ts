import BaseException from '@shared/domain/exceptions/base.exception'
import ErrorMessages from '../utils/error-messages/error-messages.util'

class UserSchemaValidationError extends BaseException {
  constructor(errorDescription: any) {
    super(ErrorMessages.USER_SCHEMA_VALIDATION, UserSchemaValidationError.name, errorDescription ?? '')
  }
}

export default UserSchemaValidationError
