/* eslint-disable n/no-path-concat */
import { DataSource, type DataSourceOptions } from 'typeorm'

const Config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  migrationsRun: true,
  logging: true,
  entities: [`${__dirname}/../../**/*.model{.ts,.js}`],
  migrations: [`${__dirname}/../migrations/*{.ts, .js}`]
}

const AppDataSource = new DataSource(Config)

export default AppDataSource
