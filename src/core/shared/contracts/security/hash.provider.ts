export interface HashProvider {
  hash: (value: string, saltRounds?: number) => Promise<string>
  compare: (value: string, hash: string) => Promise<boolean>
}
