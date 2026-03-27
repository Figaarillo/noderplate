export interface RuntimeConfig {
  httpRuntime: 'fastify' | 'express' | 'nest'
  nodeEnv: string
  port: number
}

export const runtime: RuntimeConfig = {
  httpRuntime: (process.env.HTTP_RUNTIME as RuntimeConfig['httpRuntime']) ?? 'nest',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 8080)
}
