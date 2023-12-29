import UserEntity from '../entities/user.entity'
import type IUserPrimitiveData from '../interfaces/user-primitive-data.interface'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class UserFactory {
  static create(data: IUserPrimitiveData): UserEntity {
    return new UserEntity(data)
  }
}

export default UserFactory
