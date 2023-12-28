import ErrorMessages from '@user/domain/utils/error-messages/error-messages.util'
import BaseException from './base.exception'

class UnexpectedError extends BaseException {
  constructor(errorDescription?: any) {
    super(ErrorMessages.UNEXPECTED_ERROR, UnexpectedError.name, errorDescription ?? '')
  }
}

export default UnexpectedError
