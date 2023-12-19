import type IBaseEntity from 'src/shared/domain/interfaces/base.entity.interface'
import type UserPayload from '../payloads/user.payload'

interface IUserEntity extends IBaseEntity, UserPayload {}

export default IUserEntity
