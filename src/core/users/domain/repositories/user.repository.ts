import type Nullable from '../../../../core/shared/types/nullable.type'
import type { User, UpdateUserInput } from '../entities/user.entity'

export interface UserRepository {
  list: (offset: number, limit: number) => Promise<Nullable<User[]>>
  findById: (id: string) => Promise<Nullable<User>>
  findByEmail: (email: string) => Promise<Nullable<User>>
  save: (user: User) => Promise<User>
  update: (id: string, data: UpdateUserInput) => Promise<Nullable<User>>
  delete: (id: string) => Promise<void>
}
