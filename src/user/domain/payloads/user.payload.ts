import { type Primitives } from '@shared/domain/utilities/primitives'
import type IUserCoreData from '../interfaces/user-core-data.interface'

interface UserPayload extends Primitives<IUserCoreData> {}

export default UserPayload
