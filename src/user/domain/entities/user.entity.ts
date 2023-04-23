import BaseEntity from '@shared/domain/entities/base.entity'
import type IUserPayload from '../payloads/user.payload'
import type IUser from './user.interface'

class User extends BaseEntity<User, IUser, IUserPayload> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: IUser) {
    super(props)
  }

  toPrimitive(): IUserPayload {
    return {
      firstName: this.data.firstName._value,
      lastName: this.data.lastName._value,
      phoneNumber: this.data.phoneNumber._value,
      birthday: this.data.birthday._value
    }
  }
}

export default User
