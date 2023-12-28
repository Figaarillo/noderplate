import { type Primitives } from '@shared/domain/types/primitives'
import type IUserCoreData from '../interfaces/user-core-data.interface'

interface UserPayload extends Primitives<IUserCoreData> {}

export default UserPayload
