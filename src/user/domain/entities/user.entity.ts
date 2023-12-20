import BaseEntity from '../../../shared/domain/entities/base.entity'
import type IUserEntity from '../interfaces/user.entity.interface'
import type UserPayload from '../payloads/user.payload'

class UserEntity extends BaseEntity implements IUserEntity {
  private _firstName: string
  private _lastName: string
  private _phoneNumber: number
  private _email: string
  private readonly _password: string

  constructor(userPayload: UserPayload) {
    super()
    this._firstName = userPayload.firstName
    this._lastName = userPayload.lastName
    this._phoneNumber = userPayload.phoneNumber
    this._email = userPayload.email
    this._password = userPayload.password
  }

  get firstName(): string {
    return this._firstName
  }

  get lastName(): string {
    return this._lastName
  }

  get phoneNumber(): number {
    return this._phoneNumber
  }

  get email(): string {
    return this._email
  }

  get password(): string {
    return this._password
  }

  update(data: Partial<UserPayload>): this {
    this._updatedAt = new Date()
    this._firstName = data.firstName ?? this._firstName
    this._lastName = data.lastName ?? this._lastName
    this._phoneNumber = data.phoneNumber ?? this._phoneNumber
    this._email = data.email ?? this._email

    return this
  }
}

export default UserEntity
