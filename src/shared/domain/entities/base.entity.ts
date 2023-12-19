import type IBaseEntity from '../interfaces/base.entity.interface'

abstract class BaseEntity implements IBaseEntity {
  protected readonly _id: string
  protected readonly _createdAt: Date
  protected _updatedAt: Date

  constructor() {
    this._id = String(Date.now())
    this._createdAt = new Date()
    this._updatedAt = new Date()
  }

  get id(): string {
    return this._id
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  abstract update(data: any): this
}

export default BaseEntity
