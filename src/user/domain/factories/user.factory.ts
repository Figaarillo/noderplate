import UserEntity from '../entities/user.entity'
import type UserPayload from '../payloads/user.payload'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class UserFactory {
  static create(data: UserPayload): UserEntity {
    return new UserEntity(data)
  }
}

export default UserFactory
