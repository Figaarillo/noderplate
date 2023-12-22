import type IBaseRepository from '@shared/infrastructure/repositories/interfaces/base.repository.interface'
import type IUserEntity from '@user/domain/interfaces/user.entity.interface'

interface IUserRepository extends IBaseRepository<IUserEntity> {}

export default IUserRepository
