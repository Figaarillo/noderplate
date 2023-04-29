import type IBaseEntity from '../interface/base.entity.interface'
import ImmutableEntity from './immutable.entity'
import { v4 as uuidv4 } from 'uuid'

abstract class BaseEntity<PrimitiveData> extends ImmutableEntity<PrimitiveData> implements IBaseEntity<PrimitiveData> {
  protected readonly _id: string
  protected readonly _createdAt: Date
  protected _updatedAt: Date

  constructor(data: PrimitiveData) {
    super(data)
    this._id = uuidv4()
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

  abstract toPrimitive(): PrimitiveData

  markAsUpdated(): void {
    this._updatedAt = new Date()
  }
}

export default BaseEntity