import {
  type PhoneNumber,
  type Email,
  type Password,
  type FirstName,
  type LastName
} from '../value-objects/user.value-object'

interface IUserCoreData {
  firstName: FirstName
  lastName: LastName
  phoneNumber: PhoneNumber
  email: Email
  password: Password
}

export default IUserCoreData
