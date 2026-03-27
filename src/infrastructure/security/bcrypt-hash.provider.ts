import { hash, compare } from 'bcryptjs'
import type { HashProvider } from '../../core/shared/application/hash.provider'

export class BcryptHashProvider implements HashProvider {
  private readonly saltRounds = 10

  async hash(value: string, saltRounds: number = this.saltRounds): Promise<string> {
    return await hash(value, saltRounds)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await compare(value, hash)
  }
}
