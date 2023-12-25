import { type Primitives } from '@shared/domain/utilities/primitives'
import DeleteUser from '@user/aplication/use-cases/delete-user.usecase'
import GetUser from '@user/aplication/use-cases/get-user.usecase'
import RegisterUser from '@user/aplication/use-cases/register-user.usecase'
import UpdateUser from '@user/aplication/use-cases/update-user.usecase'
import type IUserEntity from '@user/domain/interfaces/user-entity.interface'
import type UpdateUserPayload from '@user/domain/payloads/update-user.payload'
import type UserPayload from '@user/domain/payloads/user.payload'
import DeleteUserDTO from '@user/infrastructure/dtos/delete-user.dto'
import GetUserByIdDTO from '@user/infrastructure/dtos/get-user-by-id.dto'
import RegisterUserDTO from '@user/infrastructure/dtos/register-user.dto'
import UpdateUserDTO from '@user/infrastructure/dtos/update-user.dto'
import SchemaValidator from '@user/infrastructure/middlewares/zod-schema-validator.middleware'
import UserInMemoryRepository from '@user/infrastructure/repositories/in-memory/user.in-memory.repository'
import type IUserRepository from '@user/infrastructure/repositories/interfaces/user.repository.interface'
import UserAdapter from './user.adapter'

class UserController {
  private readonly repository: IUserRepository

  constructor() {
    this.repository = new UserInMemoryRepository()
  }

  async registerUser(payload: UserPayload): Promise<Primitives<IUserEntity>> {
    const registerUseCase = new RegisterUser(this.repository)

    const schemaValidator = new SchemaValidator(RegisterUserDTO, payload)
    schemaValidator.exec()

    const userRegistered = await registerUseCase.exec(payload)

    return UserAdapter(userRegistered)
  }

  async deleteUser(id: string): Promise<Primitives<IUserEntity>> {
    const deleteUseCase = new DeleteUser(this.repository)

    const deletePayload: Partial<UpdateUserPayload> = { id }

    const schemaValidator = new SchemaValidator(DeleteUserDTO, deletePayload)
    schemaValidator.exec()

    const userDeleted = await deleteUseCase.exec(id)

    return UserAdapter(userDeleted)
  }

  async getUserById(id: string): Promise<Primitives<IUserEntity>> {
    const getUseCase = new GetUser(this.repository)

    const getUserPayload: Partial<UpdateUserPayload> = { id }

    const schemaValidator = new SchemaValidator(GetUserByIdDTO, getUserPayload)
    schemaValidator.exec()

    return UserAdapter(await getUseCase.exec(id))
  }

  async updateUser(payload: UpdateUserPayload): Promise<Primitives<IUserEntity>> {
    const updateUseCase = new UpdateUser(this.repository)

    const schemaValidator = new SchemaValidator(UpdateUserDTO, payload)
    schemaValidator.exec()

    const userUpdated = await updateUseCase.exec(payload)

    return UserAdapter(userUpdated)
  }
}

export default UserController
