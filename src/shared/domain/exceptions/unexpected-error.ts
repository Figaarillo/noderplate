class UnexpectedError extends Error {
  constructor(
    readonly description: string,
    readonly name: string = UnexpectedError.name
  ) {
    super(description)
  }
}

export default UnexpectedError
