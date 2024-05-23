import { CreateAt, Id, UpdateAt } from '@shared/domain/value-objects/base.value-object'
import City from '../value-objects/city.value-object'
import Country from '../value-objects/country.value-object'
import Email from '../value-objects/email.value-object'
import FirstName from '../value-objects/firstname.value-object'
import LastName from '../value-objects/lastname.value-object'
import Password from '../value-objects/password.value-object'
import PhoneNumber from '../value-objects/phonenumber.value-object'
import Province from '../value-objects/province.value-object'
import Role from '../value-objects/role.value-object'
import type UserDTO from '../dto/user.dto'

class UserEntity {
  private readonly id: Id = new Id()
  private readonly createdAt: CreateAt = new CreateAt()
  private updatedAt: UpdateAt = new UpdateAt()
  private firstName: FirstName
  private lastName: LastName
  private email: Email
  private readonly password: Password
  private phoneNumber: PhoneNumber
  private city: City
  private province: Province
  private conuntry: Country
  private role: Role

  constructor(data: UserDTO) {
    this.firstName = new FirstName(data.firstName)
    this.lastName = new LastName(data.lastName)
    this.email = new Email(data.email)
    this.password = new Password(data.password)
    this.phoneNumber = new PhoneNumber(data.phoneNumber)
    this.city = new City(data.city)
    this.province = new Province(data.province)
    this.conuntry = new Country(data.country)
    this.role = new Role(data.role)
  }

  update(data: UserDTO): void {
    this.updatedAt = new UpdateAt()
    if (data.firstName !== undefined) {
      this.firstName = new FirstName(data.firstName)
    }
    if (data.lastName !== undefined) {
      this.lastName = new LastName(data.lastName)
    }
    if (data.email !== undefined) {
      this.email = new Email(data.email)
    }
    if (data.phoneNumber !== undefined) {
      this.phoneNumber = new PhoneNumber(data.phoneNumber)
    }
    if (data.city !== undefined) {
      this.city = new City(data.city)
    }
    if (data.province !== undefined) {
      this.province = new Province(data.province)
    }
    if (data.country !== undefined) {
      this.conuntry = new Country(data.country)
    }
    if (data.role !== undefined) {
      this.role = new Role(data.role)
    }
  }

  getDTO(): UserDTO {
    return {
      id: this.id.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
      password: this.password.value,
      phoneNumber: this.phoneNumber.value,
      city: this.city.value,
      province: this.province.value,
      country: this.conuntry.value,
      role: this.role.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt.value
    }
  }
}

export default UserEntity
