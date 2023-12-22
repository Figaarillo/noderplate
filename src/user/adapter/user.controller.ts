import CreateUser from '@user/aplication/use-cases/create-user.usecase'
import DeleteUser from '@user/aplication/use-cases/delete-user.usecase'
import GetUser from '@user/aplication/use-cases/get-user.usecase'
import UpdateUser from '@user/aplication/use-cases/update-user.usecase'
import type IUserEntity from '@user/domain/interfaces/user-entity.interface'
import type UpdateUserPayload from '@user/domain/payloads/update-user.payload'
import type UserPayload from '@user/domain/payloads/user.payload'
import UserInMemoryRepository from '@user/infrastructure/repositories/in-memory/user.in-memory.repository'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'

class UserController {
  private readonly repository: IUserRepository
  private readonly create: CreateUser
  private readonly delete: DeleteUser
  private readonly get: GetUser
  private readonly update: UpdateUser

  constructor() {
    this.repository = new UserInMemoryRepository()
    this.create = new CreateUser(this.repository)
    this.delete = new DeleteUser(this.repository)
    this.get = new GetUser(this.repository)
    this.update = new UpdateUser(this.repository)
  }

  async createUser(payload: UserPayload): Promise<IUserEntity> {
    try {
      return await this.create.exec(payload)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      // eslint-disable-next-line prettier/prettier
      throw new Error('User could not be created')
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.delete.exec(id)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      // eslint-disable-next-line prettier/prettier
      throw new Error('User could not be deleted')
    }
  }

  async getUserById(id: string): Promise<IUserEntity | null> {
    try {
      return await this.get.exec(id)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      // eslint-disable-next-line prettier/prettier
      throw new Error('User could not be found')
    }
  }

  async updateUser(payload: UpdateUserPayload): Promise<IUserEntity> {
    try {
      return await this.update.exec(payload)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
      // eslint-disable-next-line prettier/prettier
      throw new Error('User could not be updated')
    }
  }
}

export default UserController
