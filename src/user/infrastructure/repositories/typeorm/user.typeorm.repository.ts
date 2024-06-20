import type Nullable from '@shared/domain/types/nullable.type'
import UserEntity from '@user/domain/entities/user.entity'
import type UserPayload from '@user/domain/payload/user.payload'
import type UserRepository from '@user/domain/repository/user.repository'
import { type DataSource, type Repository } from 'typeorm'

class UserTypeormRepository implements UserRepository {
  private readonly repository: Repository<UserEntity>

  constructor(private readonly db: DataSource) {
    this.repository = this.initRepository()
  }

  private initRepository(): Repository<UserEntity> {
    const getConnect = this.db

    return getConnect.getRepository(UserEntity)
  }

  async List(offset: number, limit: number): Promise<Nullable<UserEntity[]>> {
    const repository = this.repository

    return await repository.find({
      skip: offset,
      take: limit,
      cache: 10000
    })
  }

  async GetByID(id: string): Promise<Nullable<UserEntity>> {
    const repository = this.repository

    return await repository.findOne({
      where: { id },
      cache: 10000
    })
  }

  async getByName(name: string): Promise<Nullable<UserEntity>> {
    const repository = this.repository

    return await repository.findOne({
      where: { firstName: name },
      cache: 10000
    })
  }

  async register(user: UserEntity): Promise<Nullable<UserEntity>> {
    const repository = this.repository

    return await repository.save(user)
  }

  async update(id: string, user: UserPayload): Promise<Nullable<void>> {
    const repository = this.repository

    await repository.update({ id }, user)
  }

  async delete(id: string): Promise<Nullable<void>> {
    const repository = this.repository

    repository.delete({ id })
  }
}

export default UserTypeormRepository
