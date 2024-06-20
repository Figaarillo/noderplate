import { GetURLParams, GetURLQueryParams, HandleHTTPResponse, type HTTPQueryParams } from '@shared/utils/http.utils'
import DeleteUser from '@user/aplication/usecases/delete.usecase'
import GetUserByIDUseCase from '@user/aplication/usecases/get-by-id.usecase'
import ListUsersUseCase from '@user/aplication/usecases/list.usecase'
import RegisterUser from '@user/aplication/usecases/register.usecase'
import UpdateUser from '@user/aplication/usecases/update.usecase'
import type UserPayload from '@user/domain/payload/user.payload'
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

  async List(req: FastifyRequest<{ Querystring: HTTPQueryParams }>, res: FastifyReply): Promise<void> {
    try {
      const { offset, limit } = GetURLQueryParams(req)

      const listUsers = new ListUsersUseCase(this.repository)
      const users = await listUsers.exec(offset, limit)

      HandleHTTPResponse(res, 'Users retrieved successfully', 200, users)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  async GetByID(req: FastifyRequest<{ Params: Record<string, string> }>, res: FastifyReply): Promise<void> {
    try {
      const id = GetURLParams(req, 'id')

      const validateIDSchema = new SchemaValidator(GetUserByIdDTO, { id })
      validateIDSchema.exec()

      const getByID = new GetUserByIDUseCase(this.repository)
      const user = await getByID.exec(id)

      HandleHTTPResponse(res, 'User retrieved successfully', 200, user)
    } catch (error) {
      res.status(500).send(error)
    }
  }

  async Save(req: FastifyRequest, _res: FastifyReply): Promise<void> {
    try {
      const payload: UserPayload = req.body as UserPayload

      const registerUseCase = new RegisterUser(this.repository)

      const schemaValidator = new SchemaValidator(RegisterUserDTO, payload)
      schemaValidator.exec()

      await registerUseCase.exec(payload)

      // TODO: send http response
    } catch (error) {
      // TODO: send http error response
    }
  }

  async Update(id: string, payload: UserPayload): Promise<void> {
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

  async Delete(id: string): Promise<void> {
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
