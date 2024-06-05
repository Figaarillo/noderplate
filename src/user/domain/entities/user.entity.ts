import { CreateAt, Id, UpdateAt } from '@shared/domain/value-objects/base.value-object'
import type UserDTO from '../dto/user.dto'
import {
  City,
  Country,
  Email,
  FirstName,
  LastName,
  Password,
  PhoneNumber,
  Province,
  Role
} from '../value-objects/user.valueobject'
import type IUserEntity from './iuser.entity'

class UserEntity implements IUserEntity {
  private readonly _id: Id = new Id()
  private readonly _createdAt: CreateAt = new CreateAt()
  private _updatedAt: UpdateAt = new UpdateAt()
  private _firstName: FirstName
  private _lastName: LastName
  private _email: Email
  private readonly _password: Password
  private _phoneNumber: PhoneNumber
  private _city: City
  private _province: Province
  private _conuntry: Country
  private _role: Role

  constructor(data: UserDTO) {
    this._firstName = new FirstName(data.firstName)
    this._lastName = new LastName(data.lastName)
    this._email = new Email(data.email)
    this._password = new Password(data.password)
    this._phoneNumber = new PhoneNumber(data.phoneNumber)
    this._city = new City(data.city)
    this._province = new Province(data.province)
    this._conuntry = new Country(data.country)
    this._role = new Role(data.role)
  }

  update(data: UserDTO): void {
    this._updatedAt = new UpdateAt()
    if (data.firstName !== undefined) {
      this._firstName = new FirstName(data.firstName)
    }
    if (data.lastName !== undefined) {
      this._lastName = new LastName(data.lastName)
    }
    if (data.email !== undefined) {
      this._email = new Email(data.email)
    }
    if (data.phoneNumber !== undefined) {
      this._phoneNumber = new PhoneNumber(data.phoneNumber)
    }
    if (data.city !== undefined) {
      this._city = new City(data.city)
    }
    if (data.province !== undefined) {
      this._province = new Province(data.province)
    }
    if (data.country !== undefined) {
      this._conuntry = new Country(data.country)
    }
    if (data.role !== undefined) {
      this._role = new Role(data.role)
    }
  }

  get id(): string {
    return this._id.value
  }

  get firstName(): string {
    return this._firstName.value
  }

  get lastName(): string {
    return this._lastName.value
  }

  get email(): string {
    return this._email.value
  }

  get password(): string {
    // TODO: Encrypt password
    return this._password.value
  }

  get phoneNumber(): number {
    return this._phoneNumber.value
  }

  get city(): string {
    return this._city.value
  }

  get province(): string {
    return this._province.value
  }

  get country(): string {
    return this._conuntry.value
  }

  get role(): string {
    return this._role.value
  }

  get createdAt(): Date {
    return this._createdAt.value
  }

  get updatedAt(): Date {
    return this._updatedAt.value
  }
}

export default UserEntity
