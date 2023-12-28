import BaseException from '@shared/domain/exceptions/base.exception'
import ErrorMessages from '../utils/error-messages/error-messages.util'

const exception = ErrorMessages.VALUE_OBJECT_FORMAT_EXCEPTION

class ValueObjectFormatException extends BaseException {
  constructor(message: string, errorDescription?: any) {
    super(
      { message: `${exception.message}: ${message}`, statusCode: exception.statusCode },
      ValueObjectFormatException.name,
      errorDescription
    )
  }
}

export default ValueObjectFormatException
