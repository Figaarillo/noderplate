import { defineConfig } from '@mikro-orm/postgresql'
import { UserMikroORM } from '../../infrastructure/persistence/mikro-orm/users/entities/user.entity'

export default defineConfig({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  user: process.env.DATABASE_USER ?? 'axel',
  password: process.env.DATABASE_PASS ?? 'secret',
  dbName: process.env.DATABASE_NAME ?? 'noderplate',
  entities:
    process.env.NODE_ENV === 'production'
      ? [UserMikroORM]
      : ['./src/infrastructure/persistence/mikro-orm/users/entities'],
  migrations: {
    path: './src/infrastructure/persistence/mikro-orm/shared/migrations'
  }
})
