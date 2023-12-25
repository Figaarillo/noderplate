class Email {
  constructor(private readonly _value: string) {
    this.ensureValueIsNotEmpty(_value)
    this.ensureValueIsValidEmail(_value)
    this._value = _value
  }

  private ensureValueIsNotEmpty(value: string | undefined | null): void {
    if (value === undefined || value === null || value === '') {
      // TODO: create a custom error
      throw new Error('Email cannot be empty')
    }
  }

  private ensureValueIsValidEmail(value: string): void {
    if (value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) == null) {
      // TODO: create a custom error
      throw new Error('Invalid email address')
    }
  }

  // TODO: Validar unicidad. No puedes tener dos usuarios con el mismo correo electrónico.
  // TODO: Validar que el correo electrónico sea de un dominio válido. Por ejemplo, solo empleados de la empresa pueden registrarse con correos de la empresa
  // TODO: Validar que el correo electrónico no esté registrado en una lista negra.
  // TODO: Validar que el usuario sea el propietario del correo electrónico mediante un enlace de verificación.

  get value(): string {
    return this._value
  }
}

export default Email
