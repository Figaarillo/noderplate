import type { User } from '../entities/user.entity'
import type { UpdateUserPayload } from '../payloads/update-user.payload'

export interface UserRepository {
  list: (offset: number, limit: number) => Promise<User[]>
  findById: (id: string) => Promise<User | null>
  findByEmail: (email: string) => Promise<User | null>
  save: (user: User) => Promise<User>
  update: (id: string, data: UpdateUserPayload) => Promise<User | null>
  delete: (id: string) => Promise<void>
}
