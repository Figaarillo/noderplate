import type IHTTPErrorMessage from './http-error-message.interface.exeption'

const HTTPErrorMessage: Record<string, IHTTPErrorMessage> = {
  UNEXPECTED_ERROR: {
    message: 'Unexpected error',
    statusCode: 500
  }
}

export default HTTPErrorMessage
