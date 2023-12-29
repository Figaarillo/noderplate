/* eslint-disable indent */
import BaseModel from '@shared/infrastructure/models/base.model'
import type UserPayload from '@user/domain/payloads/user.payload'
import { Column, Entity } from 'typeorm'

@Entity({ name: 'users' })
class UserModel extends BaseModel implements UserPayload {
  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column()
  email!: string

  @Column()
  password!: string

  @Column()
  phoneNumber!: number

  @Column()
  city!: string

  @Column()
  province!: string

  @Column()
  country!: string

  @Column()
  role!: string
}

export default UserModel
