/* eslint-disable indent */
import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 as uuidv4 } from 'uuid'

@Entity()
export class UserMikroORM {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property()
  firstName!: string

  @Property()
  lastName!: string

  @Property({ unique: true })
  email!: string

  @Property()
  password!: string

  @Property()
  phoneNumber!: number

  @Property()
  city!: string

  @Property()
  province!: string

  @Property()
  country!: string

  @Property()
  role!: string

  @Property()
  createdAt!: Date

  @Property()
  updatedAt!: Date

  constructor() {
    this.id = uuidv4()
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}
