import { type Primitives } from '@shared/domain/utilities/primitives'
import DeleteUser from '@user/aplication/use-cases/delete-user.usecase'
import GetUser from '@user/aplication/use-cases/get-user.usecase'
import RegisterUser from '@user/aplication/use-cases/register-user.usecase'
import UpdateUser from '@user/aplication/use-cases/update-user.usecase'
import type IUserEntity from '@user/domain/interfaces/user-entity.interface'
import type UpdateUserPayload from '@user/domain/payloads/update-user.payload'
import type UserPayload from '@user/domain/payloads/user.payload'
import DeleteUserDTO from '@user/infrastructure/dtos/delete-user.dto'
import RegisterUserDTO from '@user/infrastructure/dtos/register-user.dto'
import SchemaValidator from '@user/infrastructure/middlewares/zod-schema-validator.middleware'
import UserInMemoryRepository from '@user/infrastructure/repositories/in-memory/user.in-memory.repository'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'
import UserAdapter from './user.adapter'

class UserController {
  private readonly repository: IUserRepository
  private readonly register: RegisterUser
  private readonly delete: DeleteUser
  private readonly get: GetUser
  private readonly update: UpdateUser

  constructor() {
    this.repository = new UserInMemoryRepository()
    this.register = new RegisterUser(this.repository)
    this.delete = new DeleteUser(this.repository)
    this.get = new GetUser(this.repository)
    this.update = new UpdateUser(this.repository)
  }

  async RegisterUser(payload: UserPayload): Promise<Primitives<IUserEntity>> {
    const registerValidator = new SchemaValidator(RegisterUserDTO, payload)

    registerValidator.exec()

    const userRegistered = await this.register.exec(payload)

    return UserAdapter(userRegistered)
  }

  async deleteUser(id: string): Promise<Primitives<IUserEntity>> {
    const deletePayload: Partial<UpdateUserPayload> = { id }

    const registerValidator = new SchemaValidator(DeleteUserDTO, deletePayload)

    registerValidator.exec()

    const userDeleted = await this.delete.exec(id)

    return UserAdapter(userDeleted)
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
