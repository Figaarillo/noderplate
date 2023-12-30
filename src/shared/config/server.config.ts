import * as dotenv from 'dotenv'

abstract class ConfigServer {
  constructor() {
    const nodeEnvPath = this.createPathToEnvFile(this.getNodeEnv())
    dotenv.config({
      path: nodeEnvPath
    })
  }

  protected getEnviroment(key: string): string | undefined {
    return process.env[key.toUpperCase()]
  }

  protected getNumberEnviroment(key: string): number | undefined {
    return Number(this.getEnviroment(key))
  }

  protected getNodeEnv(): string {
    return this.getEnviroment('NODE_ENV')?.trim() ?? ''
  }

  protected createPathToEnvFile(path: string): string {
    const ENV: string = '.env'

    if (path.length > 0) {
      return `${ENV}.${path}`
    }

    return ENV
  }
}

export default ConfigServer
