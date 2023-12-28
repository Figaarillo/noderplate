import ValueObjectFormatException from '../exceptions/value-object-format.exception'

class Password {
  constructor(private readonly _value: string) {
    this.ensurePasswordLength(_value)
    this.ensureValueIsValidPasswordComplexity(_value)
    this._value = _value
  }

  private ensurePasswordLength(value: string): void {
    if (value.length < 8) {
      throw new ValueObjectFormatException('Password must be at least 8 characters long')
    }
  }

  private ensureValueIsValidPasswordComplexity(value: string): void {
    if (value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[{\]};:<>|./?,-]).{8,}$/) == null) {
      throw new ValueObjectFormatException(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      )
    }
  }

  // TODO: Validar que la contraseña no contenga información personal del usuario.
  // TODO: Validar que la contraseña sea segura mediante una herramienta de análisis de contraseñas.
  // TODO: No debe ser igual a ninguna de las últimas 5 contraseñas utilizadas por el usuario.
  // TODO: Expiración de contraseñas y políticas de cambio periódico: La contraseña debe cambiarse cada 90 días, por ejemplo.

  get value(): string {
    return this._value
  }
}

export default Password
