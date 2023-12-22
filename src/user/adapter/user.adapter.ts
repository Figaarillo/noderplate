import { type Primitives } from '@shared/domain/utilities/primitives'
import type IUserEntity from '@user/domain/interfaces/user-entity.interface'

const UserAdapter = (user: IUserEntity): Primitives<IUserEntity> => ({
  id: user.id.value,
  firstName: user.firstName.value,
  lastName: user.lastName.value,
  phoneNumber: user.phoneNumber.value,
  email: user.email.value,
  password: user.password.value,
  createdAt: user.createdAt.value,
  updatedAt: user.updatedAt.value
})

export default UserAdapter
