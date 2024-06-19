import Fastify from 'fastify'

class FastifyConifg {
  constructor(
    readonly fastify = Fastify({
      logger: true
    })
  ) {}
}

export default FastifyConifg
