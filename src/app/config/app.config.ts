import { getEnv, getEnvOrDefault, getNumberEnv } from './env'

export const appConfig = {
  port: getNumberEnv('PORT'),
  nodeEnv: getEnvOrDefault('NODE_ENV', 'development'),
  database: {
    host: getEnvOrDefault('DATABASE_HOST', 'localhost'),
    port: getNumberEnv('DATABASE_PORT'),
    username: getEnv('DATABASE_USER'),
    password: getEnv('DATABASE_PASS'),
    name: getEnv('DATABASE_NAME')
  },
  jwt: {
    secret: getEnvOrDefault('JWT_SECRET', 'default-secret'),
    expiresIn: getEnvOrDefault('JWT_EXPIRES_IN', '1h')
  }
}
