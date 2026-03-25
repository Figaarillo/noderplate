import * as dotenv from 'dotenv'
import { join } from 'path'

dotenv.config({
  path: join(process.cwd(), `.env.${process.env.NODE_ENV ?? ''}`)
})

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
