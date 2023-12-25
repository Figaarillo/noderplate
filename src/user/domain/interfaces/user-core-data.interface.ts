import type City from '../value-objects/city.value-object'
import type Country from '../value-objects/country.value-object'
import type Email from '../value-objects/email.value-object'
import type FirstName from '../value-objects/firstname.value-object'
import type LastName from '../value-objects/lastname.value-object'
import type Password from '../value-objects/password.value-object'
import type PhoneNumber from '../value-objects/phonenumber.value-object'
import type Province from '../value-objects/province.value-object'
import type Role from '../value-objects/role.value-object'

interface IUserCoreData {
  firstName: FirstName
  lastName: LastName
  email: Email
  password: Password
  phoneNumber: PhoneNumber
  city: City
  province: Province
  country: Country
  role: Role
}

export default IUserCoreData
