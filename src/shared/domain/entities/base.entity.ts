import type IBaseEntity from '../interfaces/base.entity.interface'
import { UpdateAt, CreateAt, Id } from '../value-objects/base.value-object'

abstract class BaseEntity implements IBaseEntity {
  protected readonly _id: Id
  protected readonly _createdAt: CreateAt
  protected _updatedAt: UpdateAt

  constructor() {
    this._id = new Id()
    this._createdAt = new CreateAt()
    this._updatedAt = new UpdateAt()
  }

  get id(): Id {
    return this._id
  }

  get createdAt(): CreateAt {
    return this._createdAt
  }

  get updatedAt(): UpdateAt {
    return this._updatedAt
  }

  abstract update(data: any): this
}

export default BaseEntity
