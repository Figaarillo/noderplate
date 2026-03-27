export class ErrorGeneratingTokenError extends Error {
  constructor(tokenType: 'access' | 'refresh') {
    super(`Error generating ${tokenType} token`)
    this.name = 'ErrorGeneratingTokenError'
  }
}
