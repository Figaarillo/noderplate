/* eslint-disable indent */
import { BeforeCreate, BeforeUpdate, Entity, EventArgs, PrimaryKey, Property, t } from '@mikro-orm/postgresql'
import { v4 as uuidv4 } from 'uuid'

@Entity({ tableName: 'users' })
export class UserMikroORM {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property()
  firstName!: string

  @Property()
  lastName!: string

  @Property({ unique: true })
  email!: string

  @Property({ type: t.text, hidden: true, lazy: true })
  password!: string

  @Property()
  phoneNumber!: string

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

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword(_args: EventArgs<UserMikroORM>): Promise<void> {
    // TODO: Implement password hashing with bcrypt in production
  }
}
