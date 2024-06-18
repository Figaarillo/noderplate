import type Nullable from '@shared/domain/types/nullable.type'
import type UserDTO from '@user/domain/dto/user.dto'
import UserEntity from '@user/domain/entities/user.entity'
import type UserRepository from '@user/domain/repository/user.repository'
import { type DataSource, type Repository } from 'typeorm'

class UserTypeormRepository implements UserRepository {
  private readonly repository: Promise<Repository<UserEntity>>

  constructor(private readonly db: Promise<DataSource>) {
    this.repository = this.initRepository()
  }

  private async initRepository(): Promise<Repository<UserEntity>> {
    const getConnect = await this.db

    return getConnect.getRepository(UserEntity)
  }

  async getAll(offset: number, limit: number): Promise<Nullable<UserEntity[]>> {
    const repository = await this.repository

    return await repository.find({
      skip: offset,
      take: limit,
      cache: 10000
    })
  }

  async getByID(id: string): Promise<Nullable<UserEntity>> {
    const repository = await this.repository

    return await repository.findOne({
      where: { id },
      cache: 10000
    })
  }

  async getByName(name: string): Promise<Nullable<UserEntity>> {
    const repository = await this.repository

    return await repository.findOne({
      where: { firstName: name },
      cache: 10000
    })
  }

  async register(user: UserEntity): Promise<Nullable<UserEntity>> {
    const repository = await this.repository

    return await repository.save(user)
  }

  async update(id: string, user: UserDTO): Promise<Nullable<void>> {
    const repository = await this.repository

    await repository.update({ id }, user)
  }

  async delete(id: string): Promise<Nullable<void>> {
    const repository = await this.repository

    repository.delete({ id })
  }
}

export default UserTypeormRepository
