import BaseException from '@shared/domain/exceptions/base.exception'
import ErrorMessages from '../utils/error-messages/error-messages.util'

class UserNotFoundException extends BaseException {
  constructor(errorDescription?: any) {
    super(ErrorMessages.USER_NOT_FOUND, UserNotFoundException.name, errorDescription ?? '')
  }
}

export default UserNotFoundException
