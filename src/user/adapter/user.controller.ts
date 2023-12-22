import CreateUser from '@user/aplication/use-cases/create-user.usecase'
import DeleteUser from '@user/aplication/use-cases/delete-user.usecase'
import GetUser from '@user/aplication/use-cases/get-user.usecase'
import UpdateUser from '@user/aplication/use-cases/update-user.usecase'
import type IUserEntity from '@user/domain/interfaces/user-entity.interface'
import type UpdateUserPayload from '@user/domain/payloads/update-user.payload'
import type UserPayload from '@user/domain/payloads/user.payload'
import ValidateUserData from '@user/infrastructure/middlewares/validate-user-data.middleware'
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

  // TODO: modify return type
  async createUser(payload: UserPayload): Promise<IUserEntity> {
    const validateUserData = new ValidateUserData(payload)

    validateUserData.validate()

    return await this.create.exec(payload)

    // TODO: adapt to return type
  }

  async deleteUser(id: string): Promise<void> {
    // TODO: implement class validator

    await this.delete.exec(id)
  }

  // TODO: modify return type
  async getUserById(id: string): Promise<IUserEntity | null> {
    // TODO: implement class validator

    return await this.get.exec(id)

    // TODO: adapt to return type
  }

  // TODO: modify return type
  async updateUser(payload: UpdateUserPayload): Promise<IUserEntity> {
    // TODO: implement class validator

    return await this.update.exec(payload)

    // TODO: adapt to return type
  }
}

export default UserController
