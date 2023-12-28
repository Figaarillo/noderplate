import type IException from './interfaces/exception.interface'

class BaseException extends Error {
  statusCode: number | null
  errorDescription: any

  constructor(exception: IException, name = BaseException.name, errorDescription: any) {
    super(exception.message)
    this.statusCode = exception?.statusCode ?? null
    this.name = name
    this.errorDescription = errorDescription
  }
}

export default BaseException
