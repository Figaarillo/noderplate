/* eslint-disable n/no-path-concat */
import { DataSource } from 'typeorm'
import ConfigServer from './server.config'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

const Config: ConfigServer = new ConfigServer()

const AppDataSource = new DataSource({
  type: 'postgres',
  host: Config.getEnviroment('db_hostname'),
  port: Config.getNumberEnviroment('db_port'),
  username: Config.getEnviroment('db_username'),
  password: Config.getEnviroment('db_password'),
  database: Config.getEnviroment('db_database'),
  synchronize: false,
  migrationsRun: true,
  logging: true,
  entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../migrations`],
  namingStrategy: new SnakeNamingStrategy()
})

export default AppDataSource
