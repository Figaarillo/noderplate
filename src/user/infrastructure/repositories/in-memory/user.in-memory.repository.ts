import BaseInMemoryRepository from '@shared/infrastructure/repositories/in-memory/base.in-memory.repository'
import type IBaseRepository from '@shared/infrastructure/repositories/interfaces/base.repository.interface'
import type IUserEntity from '@user/domain/interfaces/user.entity.interface'

class UserInMemoryRepository
  extends BaseInMemoryRepository<IUserEntity>
  implements IBaseRepository<IUserEntity> {}
export default UserInMemoryRepository
