/* eslint-disable indent */
import type IBaseEntity from '@shared/domain/interfaces/base.entity.interface'
import type AttributesOnly from '@shared/domain/types/attributes-only.type'
import { type Primitives } from '@shared/domain/types/primitives'
import { Column, Entity } from 'typeorm'

@Entity()
class BaseModel implements AttributesOnly<Primitives<IBaseEntity>> {
  @Column()
  id!: string

  @Column()
  createdAt!: Date

  @Column()
  updatedAt!: Date
}

export default BaseModel
