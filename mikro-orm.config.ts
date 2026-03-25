import { defineConfig } from '@mikro-orm/postgresql'

export default defineConfig({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  user: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASS ?? 'postgres',
  dbName: process.env.DATABASE_NAME ?? 'noderplate',
  entities: ['./dist/infrastructure/persistence/mikro-orm/entities'],
  migrations: {
    path: './dist/infrastructure/persistence/mikro-orm/migrations'
  }
})
