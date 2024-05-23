import ValueObjectFormatException from '../exceptions/value-object-format.exception'

export class FirstName {
  constructor(private readonly _value: string) {
    this.validateMaxAndMinLength(_value)
    this.validateAllowedCharacters(_value)
    this._value = _value
  }

  private validateMaxAndMinLength(value: string): void {
    if (value.length < 2 || value.length > 50) {
      // eslint-disable-next-line quotes
      throw new ValueObjectFormatException("First name's length must be between 2 and 50")
    }
  }

  private validateAllowedCharacters(value: string): void {
    if (value.match(/^[a-zA-Z]+$/) == null) {
      throw new ValueObjectFormatException('First name must only contain letters')
    }
  }

  // TODO: Validar: nombre no debe contener palabras comunes o nombres de empresas.
  // TODO: Validar: nombre no debe coincidir con los datos de un documento de identidad válido.
  // TODO: Validar: no se permiten ciertos nombres que sean ofensivos o inapropiados.

  get value(): string {
    return this._value
  }
}

export class LastName {
  constructor(private readonly _value: string) {
    this.validateMaxAndMinLength(_value)
    this.validateAllowedCharacters(_value)
    this._value = _value
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

export class Email {
  constructor(private readonly _value: string) {
    this.ensureValueIsNotEmpty(_value)
    this.ensureValueIsValidEmail(_value)
    this._value = _value
  }

  private ensureValueIsNotEmpty(value: string | undefined | null): void {
    if (value === undefined || value === null || value === '') {
      throw new ValueObjectFormatException('Email cannot be empty')
    }
  }

  private ensureValueIsValidEmail(value: string): void {
    if (value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) == null) {
      throw new ValueObjectFormatException('Email must be a valid email address')
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

export class Password {
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

export class PhoneNumber {
  constructor(private readonly _value: number) {
    this.ensureValueIsNotEmpty(_value)
    this._value = _value
  }

  private ensureValueIsNotEmpty(value: number | undefined | null): void {
    if (value === undefined || value === null) {
      throw new ValueObjectFormatException('Phone number cannot be empty')
    }
  }

  // TODO: Validar unicidad: No puedes tener dos usuarios con el mismo número de teléfono.
  // TODO: Validar formato. El número de teléfono debe seguir un formato específico según el estándar internacional. Por ejemplo, si estás en Argentina, el número de teléfono debe tener 10 dígitos y comenzar con ‘9’ después del código de país ‘+54’.
  // TODO: Posibilidad de incluir o no prefijo de país: El número puede tener o no un prefijo de país, pero si se incluye, debe ser válido.
  // TODO: Restricciones adicionales específicas del dominio: Evitar rangos específicos de números que no se permiten en tu dominio.
  // TODO: Validar que el número de teléfono no esté registrado en una lista negra.
  // TODO: Validar que el número de teléfono sea de un operador de telefonía móvil válido.

  get value(): number {
    return this._value
  }
}

export class City {
  constructor(private readonly _value: string) {
    this.validateMaxAndMinLength(_value)
    this.validateAllowedCharacters(_value)
    this._value = _value
  }

  private validateMaxAndMinLength(value: string): void {
    if (value.length < 2 || value.length > 50) {
      // eslint-disable-next-line quotes
      throw new ValueObjectFormatException("City's length must be between 2 and 50")
    }
  }

  private validateAllowedCharacters(value: string): void {
    if (value.match(/^[a-zA-Z ]+$/) == null) {
      throw new ValueObjectFormatException('City must only contain letters')
    }
  }

  get value(): string {
    return this._value
  }
}

export class Province {
  constructor(private readonly _value: string) {
    this.validateMaxAndMinLength(_value)
    this.validateAllowedCharacters(_value)
    this._value = _value
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

export class Country {
  constructor(private readonly _value: string) {
    this.validateMaxAndMinLength(_value)
    this.validateAllowedCharacters(_value)
    this._value = _value
  }

  private validateMaxAndMinLength(value: string): void {
    if (value.length < 2 || value.length > 50) {
      throw new ValueObjectFormatException('Country name must be between 2 and 50')
    }
  }

  private validateAllowedCharacters(value: string): void {
    if (value.match(/^[a-zA-Z ]+$/) == null) {
      throw new ValueObjectFormatException('Country name must only contain letters')
    }
  }

  get value(): string {
    return this._value
  }
}

export class Role {
  private readonly _value: string

  constructor(value: string) {
    this._value = value
  }

  get value(): string {
    return this._value
  }
}