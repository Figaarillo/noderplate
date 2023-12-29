import { type Primitives } from '@shared/domain/types/primitives'
import type IUserCoreData from './user-core-data.interface'

interface IUserPrimitiveData extends Primitives<IUserCoreData> {}

export default IUserPrimitiveData
