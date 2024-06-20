import type Nullable from '@shared/domain/types/nullable.type'
import type UserEntity from '../entities/user.entity'
import type UserDTO from '../dto/user.dto'

interface UserRepository {
  List: (offset: number, limit: number) => Promise<Nullable<UserEntity[]>>
  GetByID: (id: string) => Promise<Nullable<UserEntity>>
  getByName: (name: string) => Promise<Nullable<UserEntity>>
  register: (user: UserEntity) => Promise<Nullable<UserEntity>>
  update: (id: string, user: UserDTO) => Promise<Nullable<void>>
  delete: (id: string) => Promise<Nullable<void>>
}

export default UserRepository
