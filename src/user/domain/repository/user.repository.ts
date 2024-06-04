import type Nullable from '@shared/domain/types/nullable.type'
import type UserEntity from '../entities/user.entity'

interface UserRepository {
  delete: (id: string) => Promise<Nullable<UserEntity>>
  getAll: () => Promise<UserEntity[]>
  getByID: (id: string) => Promise<Nullable<UserEntity>>
  getByProperty: (property: Record<string, any>) => Promise<Nullable<UserEntity>>
  register: (user: UserEntity) => Promise<UserEntity>
  update: (user: UserEntity) => Promise<void>
}

export default UserRepository
