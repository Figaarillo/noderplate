/* eslint-disable n/no-path-concat */
import { DataSource, type DataSourceOptions } from 'typeorm'
import ConfigServer from './server.config'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

export class ConfigTypeorm extends ConfigServer {
  private readonly config: DataSourceOptions
  private readonly AppDataSource: DataSource
  private static instance: ConfigTypeorm

  private constructor() {
    super()
    this.config = this.setupConfig()
    this.AppDataSource = new DataSource(this.config)
  }

  private setupConfig(): DataSourceOptions {
    return {
      type: 'postgres',
      host: this.getEnviroment('db_hostname'),
      port: this.getNumberEnviroment('db_port'),
      username: this.getEnviroment('db_username'),
      password: this.getEnviroment('db_password'),
      database: this.getEnviroment('db_database'),
      synchronize: false,
      migrationsRun: true,
      logging: true,
      entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
      migrations: [`${__dirname}/../migrations`],
      namingStrategy: new SnakeNamingStrategy()
    }
  }

  async initDBConnection(): Promise<DataSource> {
    return await this.AppDataSource.initialize()
  }

  static getInstance(): ConfigTypeorm {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!ConfigTypeorm.instance) {
      ConfigTypeorm.instance = new ConfigTypeorm()
    }

    return ConfigTypeorm.instance
  }
}
