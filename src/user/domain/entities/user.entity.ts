import { Id, CreateAt, UpdateAt } from '../../../shared/domain/value-objects/base.value-object'
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
  readonly id: string
  readonly createdAt: Date
  updatedAt: Date
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: number
  city: string
  province: string
  country: string
  role: string

  constructor(payload: UserDTO) {
    this.id = new Id().value
    this.createdAt = new CreateAt().value
    this.updatedAt = new UpdateAt().value
    this.firstName = new FirstName(payload.firstName).value
    this.lastName = new LastName(payload.lastName).value
    this.email = new Email(payload.email).value
    this.password = new Password(payload.password).value
    this.phoneNumber = new PhoneNumber(payload.phoneNumber).value
    this.city = new City(payload.city).value
    this.province = new Province(payload.province).value
    this.country = new Country(payload.country).value
    this.role = new Role(payload.role).value
  }

  update(data: UserDTO): void {
    this.updatedAt = new UpdateAt().value
    if (data.firstName !== undefined || data.lastName !== '') {
      this.firstName = new FirstName(data.firstName).value
    }
    if (data.lastName !== undefined || data.lastName !== '') {
      this.lastName = new LastName(data.lastName).value
    }
    if (data.phoneNumber !== undefined) {
      this.phoneNumber = new PhoneNumber(data.phoneNumber).value
    }
    if (data.city !== undefined || data.city !== '') {
      this.city = new City(data.city).value
    }
    if (data.province !== undefined || data.province !== '') {
      this.province = new Province(data.province).value
    }
    if (data.country !== undefined || data.country !== '') {
      this.country = new Country(data.country).value
    }
  }
}

export default UserEntity
