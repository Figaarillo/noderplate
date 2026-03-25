export class CannotSaveUserError extends Error {
  readonly code: number = 500

  constructor(message?: string) {
    super(message ?? 'Cannot save user')
    this.name = 'CannotSaveUserError'
  }
}
