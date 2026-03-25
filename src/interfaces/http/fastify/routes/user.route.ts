import type { FastifyInstance } from 'fastify'
import { UserController, type PaginationQuery, type IdParams } from '../controllers/user.controller'
import type { CreateUserInput, UpdateUserInput } from '@core/users/domain/entities/user.entity'
import type { UserRepository } from '@core/users/domain/repositories/user.repository'

export function registerUserRoutes(fastify: FastifyInstance, repository: UserRepository): void {
  const controller = new UserController(repository)

  fastify.get<{ Querystring: PaginationQuery }>('/api/users', async (req, res) => {
    await controller.list(req, res)
  })
  fastify.get<{ Params: IdParams }>('/api/users/:id', async (req, res) => {
    await controller.getById(req, res)
  })
  fastify.post<{ Body: CreateUserInput }>('/api/users', async (req, res) => {
    await controller.create(req, res)
  })
  fastify.put<{ Params: IdParams; Body: UpdateUserInput }>('/api/users/:id', async (req, res) => {
    await controller.update(req, res)
  })
  fastify.delete<{ Params: IdParams }>('/api/users/:id', async (req, res) => {
    await controller.delete(req, res)
  })
}
