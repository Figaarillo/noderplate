import ValueObjectFormatException from '../exceptions/value-object-format.exception'

class Province {
  private readonly _value: string

  constructor(value: string) {
    this.validateMaxAndMinLength(value)
    this.validateAllowedCharacters(value)
    this._value = value
  }

  private validateMaxAndMinLength(value: string): void {
    if (value.length < 2 || value.length > 50) {
      throw new ValueObjectFormatException('Province name must be between 2 and 50')
    }
  }

  private validateAllowedCharacters(value: string): void {
    if (value.match(/^[a-zA-Z ]+$/) == null) {
      throw new ValueObjectFormatException('Province must only contain letters and spaces')
    }
  }

  get value(): string {
    return this._value
  }
}

export default Province
