export class UserNotFoundError extends Error {
  readonly code: number = 404

  constructor(message?: string) {
    super(message ?? 'User not found')
    this.name = 'UserNotFoundError'
  }
}
