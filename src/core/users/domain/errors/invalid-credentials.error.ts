export class InvalidCredentialsError extends Error {
  readonly code: number = 401

  constructor(message?: string) {
    super(message ?? 'Invalid credentials provided')
    this.name = 'InvalidCredentialsError'
  }
}
