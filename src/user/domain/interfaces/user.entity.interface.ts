import type IBaseEntity from '@shared/domain/interfaces/base.entity.interface'
import {
  type PhoneNumber,
  type Email,
  type Password,
  type FirstName,
  type LastName
} from '../value-objects/user.value-object'

interface IUserEntity extends IBaseEntity {
  firstname: FirstName
  lastname: LastName
  phoneNumber: PhoneNumber
  email: Email
  password: Password
}

export default IUserEntity
