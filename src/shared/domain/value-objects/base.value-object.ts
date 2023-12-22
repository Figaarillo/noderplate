export class Id {
  private readonly _value: string

  constructor() {
    this._value = String(Date.now())
  }

  get value(): string {
    return this._value
  }
}

export class CreateAt {
  private readonly _value: Date

  constructor() {
    this._value = new Date()
  }

  get value(): Date {
    return this._value
  }
}

export class UpdateAt {
  private readonly _value: Date

  constructor() {
    this._value = new Date()
  }

  get value(): Date {
    return this._value
  }
}
