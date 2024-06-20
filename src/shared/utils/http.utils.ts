import { type FastifyRequest, type FastifyReply } from 'fastify'

export interface HTTPQueryParams {
  offset: string
  limit: string
}

interface HTTPURLParamsReturn {
  offset: number
  limit: number
}

export function GetURLQueryParams(req: FastifyRequest<{ Querystring: HTTPQueryParams }>): HTTPURLParamsReturn {
  const offset = parseInt(req.query.offset ?? '0')
  const limit = parseInt(req.query.limit ?? '10')

  return {
    offset,
    limit
  }
}

export function HandleHTTPResponse(res: FastifyReply, message: string, code: number, data?: any): void {
  const response = {
    message,
    success: true,
    data
  }
  res.status(code).send(response)
}
