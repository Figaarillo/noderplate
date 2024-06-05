import { type DataSource } from 'typeorm'
import type UserRepository from './domain/repository/user.repository'
import UserInMemoryRepository from './infrastructure/repositories/in-memory/user.in-memory.repository'
import UserHandler from './infrastructure/handler/user.handler'

function BootstrapUser(_db: DataSource): void {
  const repository: UserRepository = new UserInMemoryRepository()

  // eslint-disable-next-line no-new
  new UserHandler(repository)
}

export default BootstrapUser
