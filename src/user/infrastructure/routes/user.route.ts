import { type HTTPQueryParams } from '@shared/utils/http.utils'
import { type FastifyInstance, type FastifyRequest } from 'fastify'
import type UserHandler from '../handler/user.handler'

class UserRoute {
  constructor(
    private readonly router: FastifyInstance,
    private readonly handler: UserHandler
  ) {}

  setupRoutes(): void {
    this.router.get('/users', async (req: FastifyRequest<{ Querystring: HTTPQueryParams }>, res) => {
      await this.handler.List(req, res)
    })
    this.router.get('/users/:id', async (req: FastifyRequest<{ Params: { id: string } }>, res) => {
      await this.handler.GetByID(req, res)
    })
    // this.router.post('/users', async (req, res) => {
    //   await this.handler.registerUser(req, res)
    // })
    // this.router.put('/users/:id', async (req, res) => {
    //   await this.handler.updateUser(req, res)
    // })
    // this.router.delete('/users/:id', async (req, res) => {
    //   await this.handler.deleteUser(req, res)
    // })
  }
}

export default UserRoute
