import argon2 from 'argon2'
import type { HashProvider } from '../../core/shared/application/hash.provider'

export class ArgonHashProvider implements HashProvider {
  async hash(value: string): Promise<string> {
    return await argon2.hash(value)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, value)
  }
}
