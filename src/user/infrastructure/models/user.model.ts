/* eslint-disable indent */
import type IUserEntity from '@user/domain/entities/iuser.entity'
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

class UserModel implements IUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp'
  })
  createdAt!: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp'
  })
  updatedAt!: Date

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column({ unique: true })
  email!: string

  @Column({ select: false })
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
