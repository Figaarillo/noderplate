/* eslint-disable indent */
import { BeforeCreate, BeforeUpdate, Entity, EventArgs, PrimaryKey, Property, t } from '@mikro-orm/postgresql'
import { hash, verify } from 'argon2'
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
  async hashPassword(args: EventArgs<UserMikroORM>): Promise<void> {
    const password = args.changeSet?.payload.password

    if (password != null) {
      this.password = await hash(password)
    }
  }

  async verifyPassword(password: string): Promise<boolean> {
    return await verify(this.password, password)
  }
}
