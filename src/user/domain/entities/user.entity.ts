import type IUserEntity from './user.interface'
import type IUserPayload from '../payloads/user.payload'
import BaseEntity from '../../../shared/domain/entities/base.entity'

class User extends BaseEntity<User, IUserPayload> implements IUserEntity {
  firstName: string
  lastName: string
  phoneNumber: number
  birthday: string

  constructor(payload: IUserPayload) {
    super(payload)
    this.firstName = payload.firstName
    this.lastName = payload.lastName
    this.phoneNumber = payload.phoneNumber
    this.birthday = payload.birthday
  }

  toPrimitive(): IUserPayload {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      birthday: this.birthday
    }
  }
}

export default User
