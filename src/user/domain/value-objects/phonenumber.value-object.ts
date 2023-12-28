import ValueObjectFormatException from '../exceptions/value-object-format.exception'

class PhoneNumber {
  private readonly _value: number

  constructor(value: number) {
    this.ensureValueIsNotEmpty(value)
    this._value = value
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

export default PhoneNumber
