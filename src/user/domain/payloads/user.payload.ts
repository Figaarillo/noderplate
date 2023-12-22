import { type Primitives } from '@shared/domain/utilities/primitives'
import type IUserEntity from '../interfaces/user.entity.interface'

interface UserPayload extends Primitives<IUserEntity> {}

export default UserPayload
