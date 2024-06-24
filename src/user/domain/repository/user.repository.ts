import type Nullable from '@shared/domain/types/nullable.type'
import type UserEntity from '../entities/user.entity'
import type UserPayload from '../payload/user.payload'

interface UserRepository {
  List: (offset: number, limit: number) => Promise<Nullable<UserEntity[]>>
  GetByID: (id: string) => Promise<Nullable<UserEntity>>
  getByName: (name: string) => Promise<Nullable<UserEntity>>
  Save: (user: UserEntity) => Promise<Nullable<UserEntity>>
  Update: (id: string, user: UserPayload) => Promise<Nullable<UserEntity>>
  delete: (id: string) => Promise<Nullable<void>>
}

export default UserRepository
