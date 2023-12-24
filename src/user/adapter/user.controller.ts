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

  constructor() {
    this.repository = new UserInMemoryRepository()
  }

  async RegisterUser(payload: UserPayload): Promise<Primitives<IUserEntity>> {
    const registerUseCase = new RegisterUser(this.repository)

    const registerValidator = new SchemaValidator(RegisterUserDTO, payload)

    registerValidator.exec()

    const userRegistered = await registerUseCase.exec(payload)

    return UserAdapter(userRegistered)
  }

  async deleteUser(id: string): Promise<Primitives<IUserEntity>> {
    const deleteUseCase = new DeleteUser(this.repository)

    const deletePayload: Partial<UpdateUserPayload> = { id }

    const registerValidator = new SchemaValidator(DeleteUserDTO, deletePayload)

    registerValidator.exec()

    const userDeleted = await deleteUseCase.exec(id)

    return UserAdapter(userDeleted)
  }

  // TODO: modify return type
  async getUserById(id: string): Promise<IUserEntity | null> {
    const getUseCase = new GetUser(this.repository)

    // TODO: implement class validator

    return await getUseCase.exec(id)

    // TODO: adapt to return type
  }

  // TODO: modify return type
  async updateUser(payload: UpdateUserPayload): Promise<IUserEntity> {
    const updateUseCase = new UpdateUser(this.repository)

    // TODO: implement class validator

    return await updateUseCase.exec(payload)

    // TODO: adapt to return type
  }
}

export default UserController
