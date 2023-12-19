import type IBaseRepository from 'src/shared/infrastructure/repositories/interfaces/base.repository.interface'
import type IUserEntity from 'src/user/domain/interfaces/user.entity.interface'

interface IUserRepository extends IBaseRepository<IUserEntity> {}

export default IUserRepository
