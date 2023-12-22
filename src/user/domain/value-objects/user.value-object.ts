export class FirstName {
  constructor(private readonly _value: string) {
    this.ensureValueIsNotEmpty(this._value)
    this._value = _value
  }

  private ensureValueIsNotEmpty(value: string | undefined | null): void {
    if (value === undefined || value === null || value === '') {
      // TODO: create a custom error
      throw new Error('Value cannot be empty')
    }
  }

  get value(): string {
    return this._value
  }
}

export class LastName {
  constructor(private readonly _value: string) {
    this.ensureValueIsNotEmpty(_value)
    this._value = _value
  }

  private ensureValueIsNotEmpty(value: string | undefined | null): void {
    if (value === undefined || value === null || value === '') {
      // TODO: create a custom error
      throw new Error('Value cannot be empty')
    }
  }

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
      // TODO: create a custom error
      throw new Error('Value cannot be empty')
    }
  }

  get value(): number {
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
      // TODO: create a custom error
      throw new Error('Value cannot be empty')
    }
  }

  private ensureValueIsValidEmail(value: string): void {
    if (!value.includes('@')) {
      // TODO: create a custom error
      throw new Error('Value is not a valid email')
    }
  }

  get value(): string {
    return this._value
  }
}

export class Password {
  constructor(private readonly _value: string) {
    this.ensureValueIsNotEmpty(_value)
    this.ensureValueIsValidPassword(_value)
    this._value = _value
  }

  private ensureValueIsNotEmpty(value: string | undefined | null): void {
    if (value === undefined || value === null || value === '') {
      // TODO: create a custom error
      throw new Error('Value cannot be empty')
    }
  }

  private ensureValueIsValidPassword(value: string): void {
    if (value.length < 8) {
      // TODO: create a custom error
      throw new Error('Value is not a valid password')
    }
  }

  get value(): string {
    return this._value
  }
}
