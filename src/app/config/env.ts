import * as dotenv from 'dotenv'
import { join } from 'path'

dotenv.config()
const envFile = `.env.${process.env.NODE_ENV}`
if (process.env.NODE_ENV) {
  dotenv.config({ path: join(process.cwd(), envFile) })
}

export function getEnv(key: string): string {
  const value = process.env[key.toUpperCase()]
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`)
  }
  return value
}

export function getEnvOrDefault(key: string, defaultValue: string): string {
  return process.env[key.toUpperCase()] ?? defaultValue
}

export function getNumberEnv(key: string, defaultValue?: number): number {
  const value = process.env[key.toUpperCase()]
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue
    throw new Error(`Environment variable ${key} is not defined`)
  }
  return Number(value)
}

export function getBooleanEnv(key: string, defaultValue?: boolean): boolean {
  const value = process.env[key.toUpperCase()]
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue
    throw new Error(`Environment variable ${key} is not defined`)
  }
  return value === 'true'
}

export const env = {
  httpRuntime: getEnvOrDefault('HTTP_RUNTIME', 'nest'),
  orm: getEnvOrDefault('ORM', 'prisma'),
  port: getNumberEnv('PORT', 8080),
  database: {
    host: getEnvOrDefault('DATABASE_HOST', 'localhost'),
    port: getNumberEnv('DATABASE_PORT', 5432),
    user: getEnv('DATABASE_USER'),
    password: getEnv('DATABASE_PASS'),
    name: getEnv('DATABASE_NAME'),
    url: getEnv('DATABASE_URL')
  },
  jwt: {
    secret: getEnv('JWT_SECRET'),
    accessTokenSecret: getEnvOrDefault('JWT_ACCESS_TOKEN_SECRET', getEnv('JWT_SECRET')),
    refreshTokenSecret: getEnvOrDefault('JWT_REFRESH_TOKEN_SECRET', getEnv('JWT_SECRET')),
    accessTokenExpiresIn: getEnvOrDefault('JWT_ACCESS_TOKEN_EXPIRES_IN', '1h'),
    refreshTokenExpiresIn: getEnvOrDefault('JWT_REFRESH_TOKEN_EXPIRES_IN', '7d')
  },
  email: {
    host: getEnvOrDefault('EMAIL_HOST', 'sandbox.smtp.mailtrap.io'),
    port: getNumberEnv('EMAIL_PORT', 2525),
    secure: getBooleanEnv('EMAIL_SECURE', false),
    auth: {
      user: getEnvOrDefault('EMAIL_USER', ''),
      pass: getEnvOrDefault('EMAIL_PASS', '')
    },
    from: getEnvOrDefault('EMAIL_FROM', 'noreply@noderplate.local')
  }
}
