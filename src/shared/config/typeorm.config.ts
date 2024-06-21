/* eslint-disable n/no-path-concat */
import { DataSource, type DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

class TypeormConfig {
  private readonly config: DataSourceOptions
  private readonly AppDataSource: DataSource

  constructor() {
    this.config = this.setupConfig()
    this.AppDataSource = new DataSource(this.config)
  }

  private setupConfig(): DataSourceOptions {
    return {
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
      migrations: [`${__dirname}/../migrations/*{.ts, .js}`],
      namingStrategy: new SnakeNamingStrategy()
    }
  }

  async initDBConnection(): Promise<DataSource> {
    const connection = await this.AppDataSource.initialize()
    // eslint-disable-next-line no-console
    console.log('Successfully connected to database! 🚀')
    return connection
  }
}

export default TypeormConfig
