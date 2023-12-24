class Password {
  constructor(private readonly _value: string) {
    this.ensureValueIsNotEmpty(_value)
    this.ensurePasswordLength(_value)
    this.ensureValueIsValidPasswordComplexity(_value)
    this._value = _value
  }

  private ensureValueIsNotEmpty(value: string | undefined | null): void {
    if (value === undefined || value === null || value === '') {
      // TODO: create a custom error
      throw new Error('Value cannot be empty')
    }
  }

  private ensurePasswordLength(value: string): void {
    if (value.length < 8) {
      // TODO: create a custom error
      throw new Error('Value is not a valid password')
    }
  }

  private ensureValueIsValidPasswordComplexity(value: string): void {
    if (value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[{\]};:<>|./?,-]).{8,}$/) == null) {
      // TODO: create a custom error
      throw new Error('Value is not a valid password complexity')
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
