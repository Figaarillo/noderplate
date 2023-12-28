import ValueObjectFormatException from '../exceptions/value-object-format.exception'

class LastName {
  private readonly _value: string

  constructor(value: string) {
    this.validateMaxAndMinLength(value)
    this.validateAllowedCharacters(value)
    this._value = value
  }

  private validateMaxAndMinLength(value: string): void {
    if (value.length < 2 || value.length > 50) {
      // eslint-disable-next-line quotes
      throw new ValueObjectFormatException("Last name's length must be between 2 and 50")
    }
  }

  private validateAllowedCharacters(value: string): void {
    if (value.match(/^[a-zA-Z ]+$/) == null) {
      throw new ValueObjectFormatException('Last name must only contain letters')
    }
  }

  // TODO: Validar: nombre no debe contener palabras comunes o nombres de empresas.
  // TODO: Validar: nombre y apellido no deben ser palabras comunes o nombres de empresas.
  // TODO: Validar: no se permiten ciertos nombres que sean ofensivos o inapropiados.

  get value(): string {
    return this._value
  }
}

export default LastName
