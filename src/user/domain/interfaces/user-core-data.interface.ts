import type Email from '../value-objects/email.value-object'
import type FirstName from '../value-objects/firstname.value-object'
import type LastName from '../value-objects/lastname.value-object'
import type Password from '../value-objects/password.value-object'
import type PhoneNumber from '../value-objects/phonenumber.value-object'

interface IUserCoreData {
  firstName: FirstName
  lastName: LastName
  phoneNumber: PhoneNumber
  email: Email
  password: Password
}

export default IUserCoreData
