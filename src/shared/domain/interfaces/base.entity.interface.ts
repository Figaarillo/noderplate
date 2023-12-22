import { type Id, type CreateAt, type UpdateAt } from '../value-objects/base.value-object'

interface IBaseEntity {
  id: Id
  createdAt: CreateAt
  updatedAt: UpdateAt
  update: (data: any) => IBaseEntity
}

export default IBaseEntity
