import BaseInMemoryRepository from 'src/shared/infrastructure/repositories/in-memory/base.in-memory.repository'
import type IBaseRepository from 'src/shared/infrastructure/repositories/interfaces/base.repository.interface'
import type IUserEntity from 'src/user/domain/interfaces/user.entity.interface'

class UserInMemoryRepository
  extends BaseInMemoryRepository<IUserEntity>
  implements IBaseRepository<IUserEntity> {}

export default UserInMemoryRepository
