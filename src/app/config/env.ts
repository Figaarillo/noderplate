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

export function getNumberEnv(key: string): number {
  return Number(getEnv(key))
}

export function getBooleanEnv(key: string): boolean {
  return getEnv(key) === 'true'
}

export const env = {
  httpRuntime: getEnvOrDefault('HTTP_RUNTIME', 'nest'),
  orm: getEnvOrDefault('ORM', 'prisma'),
  port: getNumberEnv('PORT') || 8080,
  database: {
    host: getEnvOrDefault('DATABASE_HOST', 'localhost'),
    port: getNumberEnv('DATABASE_PORT'),
    user: getEnv('DATABASE_USER'),
    password: getEnv('DATABASE_PASS'),
    name: getEnv('DATABASE_NAME'),
    url: getEnvOrDefault(
      'DATABASE_URL',
      `postgresql://${process.env.DATABASE_USER ?? 'postgres'}:${process.env.DATABASE_PASS ?? 'postgres'}@${
        process.env.DATABASE_HOST ?? 'localhost'
      }:${process.env.DATABASE_PORT ?? 5432}/${process.env.DATABASE_NAME ?? 'noderplate'}`
    )
  },
  jwt: {
    secret: getEnvOrDefault('JWT_SECRET', 'default-secret'),
    accessTokenSecret: getEnvOrDefault('JWT_ACCESS_TOKEN_SECRET', getEnvOrDefault('JWT_SECRET', 'default-secret')),
    refreshTokenSecret: getEnvOrDefault('JWT_REFRESH_TOKEN_SECRET', getEnvOrDefault('JWT_SECRET', 'default-secret')),
    accessTokenExpiresIn: getEnvOrDefault('JWT_ACCESS_TOKEN_EXPIRES_IN', '1h'),
    refreshTokenExpiresIn: getEnvOrDefault('JWT_REFRESH_TOKEN_EXPIRES_IN', '7d')
  },
  email: {
    host: getEnvOrDefault('EMAIL_HOST', 'smtp.mailtrap.io'),
    port: getNumberEnv('EMAIL_PORT') || 587,
    secure: getBooleanEnv('EMAIL_SECURE'),
    auth: {
      user: getEnvOrDefault('EMAIL_USER', ''),
      pass: getEnvOrDefault('EMAIL_PASS', '')
    },
    from: getEnvOrDefault('EMAIL_FROM', 'noreply@example.com')
  }
}
