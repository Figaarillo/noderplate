import {
  GetPaginationParams as GetURLQueryParams,
  type HTTPURLParams as HTTPQueryParams
} from '@shared/utils/http.utils'
import DeleteUser from '@user/aplication/usecases/delete.usecase'
import GetAllUserUseCase from '@user/aplication/usecases/get-all.usecase'
import GetUserByID from '@user/aplication/usecases/get-by-id.usecase'
import RegisterUser from '@user/aplication/usecases/register.usecase'
import UpdateUser from '@user/aplication/usecases/update.usecase'
import type UserDTO from '@user/domain/dto/user.dto'
import type UserRepository from '@user/domain/repository/user.repository'
import { type FastifyReply, type FastifyRequest } from 'fastify'
import DeleteUserDTO from '../dtos/delete-user.dto'
import GetUserByIdDTO from '../dtos/get-user-by-id.dto'
import RegisterUserDTO from '../dtos/register-user.dto'
import UpdateUserDTO from '../dtos/update-user.dto'
import SchemaValidator from '../middlewares/zod-schema-validator.middleware'

class UserHandler {
  constructor(private readonly repository: UserRepository) {
    this.repository = repository
  }

  async GetAllUser(req: FastifyRequest<{ Querystring: HTTPQueryParams }>, res: FastifyReply): Promise<void> {
    try {
      const { offset, limit } = GetURLQueryParams(req)

      const getAllUsersUseCase = new GetAllUserUseCase(this.repository)
      const users = await getAllUsersUseCase.exec(offset, limit)

      res.send(users)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  async getUserById(id: string): Promise<void> {
    try {
      const getUserByIdUseCase = new GetUserByID(this.repository)

      const schemaValidator = new SchemaValidator(GetUserByIdDTO, { id })
      schemaValidator.exec()

      await getUserByIdUseCase.exec(id)

      // TODO: send http response
    } catch (error) {
      // TODO: send http error response
    }
  }

  async registerUser(payload: UserDTO): Promise<void> {
    try {
      const registerUseCase = new RegisterUser(this.repository)

      const schemaValidator = new SchemaValidator(RegisterUserDTO, payload)
      schemaValidator.exec()

      await registerUseCase.exec(payload)

      // TODO: send http response
    } catch (error) {
      // TODO: send http error response
    }
  }

  async updateUser(id: string, payload: UserDTO): Promise<void> {
    try {
      const updateUseCase = new UpdateUser(this.repository)

      const schemaValidator = new SchemaValidator(UpdateUserDTO, payload)
      schemaValidator.exec()

      await updateUseCase.exec(id, payload)

      // TODO: send http response
    } catch (error) {
      // TODO: send http error response
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const deleteUseCase = new DeleteUser(this.repository)

      const schemaValidator = new SchemaValidator(DeleteUserDTO, { id })

      schemaValidator.exec()

      await deleteUseCase.exec(id)

      // TODO: send http response
    } catch (error) {
      // TODO: send http error response
    }
  }
}

export default UserHandler
