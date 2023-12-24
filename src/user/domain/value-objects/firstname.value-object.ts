class FirstName {
  private readonly _value: string

  constructor(value: string) {
    this.validateMaxAndMinLength(value)
    this._value = value
  }

  validateMaxAndMinLength(value: string): void {
    if (value.length < 2 || value.length > 50) {
      // TODO: create a custom error
      throw new Error('Value is not a valid name')
    }
  }

  validateAllowedCharacters(value: string): void {
    if (value.match(/^[a-zA-Z]+$/) == null) {
      // TODO: create a custom error
      throw new Error('Value is not a valid name')
    }
  }

  // TODO: Validar: nombre no debe contener palabras comunes o nombres de empresas.
  // TODO: Validar: nombre no debe coincidir con los datos de un documento de identidad válido.
  // TODO: Validar: no se permiten ciertos nombres que sean ofensivos o inapropiados.

  get value(): string {
    return this._value
  }
}

export default FirstName
