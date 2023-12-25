class Country {
  private readonly _value: string

  constructor(value: string) {
    this.validateMaxAndMinLength(value)
    this.validateAllowedCharacters(value)
    this._value = value
  }

  private validateMaxAndMinLength(value: string): void {
    if (value.length < 2 || value.length > 50) {
      // TODO: create a custom error
      throw new Error('Country is not a valid name')
    }
  }

  private validateAllowedCharacters(value: string): void {
    if (value.match(/^[a-zA-Z ]+$/) == null) {
      // TODO: create a custom error
      throw new Error('Country name is not a valid name')
    }
  }

  get value(): string {
    return this._value
  }
}

export default Country
