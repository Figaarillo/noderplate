import { defineConfig } from '@mikro-orm/core'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'

export const mikroORMConfig = defineConfig({
  driver: PostgreSqlDriver,
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  user: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASS ?? 'postgres',
  dbName: process.env.DATABASE_NAME ?? 'noderplate',
  entities: ['./src/infrastructure/persistence/mikro-orm/entities'],
  migrations: {
    path: './src/infrastructure/persistence/mikro-orm/migrations'
  }
})
