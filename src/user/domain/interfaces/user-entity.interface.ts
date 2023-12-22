import type IBaseEntity from '@shared/domain/interfaces/base.entity.interface'
import type IUserCoreData from './user-core-data.interface'

interface IUserEntity extends IBaseEntity, IUserCoreData {}

export default IUserEntity
