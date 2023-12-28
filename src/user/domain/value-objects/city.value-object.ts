import ValueObjectFormatException from '../exceptions/value-object-format.exception'

class City {
  private readonly _value: string

  constructor(value: string) {
    this.validateMaxAndMinLength(value)
    this.validateAllowedCharacters(value)
    this._value = value
  }

  private validateMaxAndMinLength(value: string): void {
    if (value.length < 2 || value.length > 50) {
      // eslint-disable-next-line quotes
      throw new ValueObjectFormatException("City's length must be between 2 and 50")
    }
  }

  private validateAllowedCharacters(value: string): void {
    if (value.match(/^[a-zA-Z ]+$/) == null) {
      // TODO: create a custom error
      throw new ValueObjectFormatException('City must only contain letters')
    }
  }

  get value(): string {
    return this._value
  }
}

export default City
