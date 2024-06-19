import { type FastifyRequest } from 'fastify'

export interface HTTPURLParams {
  offset: string
  limit: string
}

interface HTTPURLParamsReturn {
  offset: number
  limit: number
}

export function GetPaginationParams(req: FastifyRequest<{ Querystring: HTTPURLParams }>): HTTPURLParamsReturn {
  const offset = parseInt(req.query.offset ?? '0')
  const limit = parseInt(req.query.limit ?? '10')

  return {
    offset,
    limit
  }
}
