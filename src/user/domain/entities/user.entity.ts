import BaseEntity from '@shared/domain/entities/base.entity'
import type IUserEntity from '../interfaces/user-entity.interface'
import type UserPayload from '../payloads/user.payload'
import { UpdateAt } from '@shared/domain/value-objects/base.value-object'
import Email from '../value-objects/email.value-object'
import FirstName from '../value-objects/firstname.value-object'
import LastName from '../value-objects/lastname.value-object'
import Password from '../value-objects/password.value-object'
import PhoneNumber from '../value-objects/phonenumber.value-object'

class UserEntity extends BaseEntity implements IUserEntity {
  private _firstName: FirstName
  private _lastName: LastName
  private _phoneNumber: PhoneNumber
  private _email: Email
  private readonly _password: Password

  constructor(userPayload: UserPayload) {
    super()
    this._firstName = new FirstName(userPayload.firstName)
    this._lastName = new LastName(userPayload.lastName)
    this._phoneNumber = new PhoneNumber(userPayload.phoneNumber)
    this._email = new Email(userPayload.email)
    this._password = new Password(userPayload.password)
  }

  get firstName(): FirstName {
    return this._firstName
  }

  get lastName(): LastName {
    return this._lastName
  }

  get phoneNumber(): PhoneNumber {
    return this._phoneNumber
  }

  get email(): Email {
    return this._email
  }

  get password(): Password {
    return this._password
  }

  update(data: Partial<UserPayload>): this {
    this._updatedAt = new UpdateAt()
    this._firstName = data.firstName !== undefined ? new FirstName(data.firstName) : this._firstName
    this._lastName = data.lastName !== undefined ? new LastName(data.lastName) : this._lastName
    this._phoneNumber = data.phoneNumber !== undefined ? new PhoneNumber(data.phoneNumber) : this._phoneNumber
    this._email = data.email !== undefined ? new Email(data.email) : this._email

    return this
  }
}

export default UserEntity
