import { beforeEach, describe, expect, it } from 'vitest'
import type { UserRepository } from '../../../features/users/domain/repositories/user.repository'
import { MockUserRepository, USER_FIXTURE, USER_FIXTURE_2, UPDATE_FIXTURE } from '../helpers'
import { RegisterUserUseCase } from '../../../features/users/application/use-cases/register.usecase'
import { DeleteUserUseCase } from '../../../features/users/application/use-cases/delete.usecase'
import { FindByIdUseCase } from '../../../features/users/application/use-cases/find-by-id.usecase'
import { FindByEmailUseCase } from '../../../features/users/application/use-cases/find-by-email.usecase'
import { ListUsersUseCase } from '../../../features/users/application/use-cases/list.usecase'
import { UpdateUserUseCase } from '../../../features/users/application/use-cases/update.usecase'

describe('User Module E2E', () => {
  let repository: UserRepository

  beforeEach(() => {
    repository = new MockUserRepository()
  })

  describe('CRUD Flow', () => {
    it('performs full CRUD lifecycle', async () => {
      const registerUseCase = new RegisterUserUseCase(repository)
      const findByIdUseCase = new FindByIdUseCase(repository)
      const updateUseCase = new UpdateUserUseCase(repository)
      const deleteUseCase = new DeleteUserUseCase(repository)

      const registered = await registerUseCase.execute(USER_FIXTURE)
      expect(registered.id).toBeDefined()

      const found = await findByIdUseCase.execute(registered.id)
      expect(found.email).toBe(USER_FIXTURE.email)

      const updated = await updateUseCase.execute(registered.id, UPDATE_FIXTURE)
      expect(updated.firstName).toBe(UPDATE_FIXTURE.firstName)

      await deleteUseCase.execute(registered.id)
      await expect(findByIdUseCase.execute(registered.id)).rejects.toThrow()
    })

    it('handles multiple users independently', async () => {
      const registerUseCase = new RegisterUserUseCase(repository)
      const findByEmailUseCase = new FindByEmailUseCase(repository)
      const listUseCase = new ListUsersUseCase(repository)

      const user1 = await registerUseCase.execute(USER_FIXTURE)
      const user2 = await registerUseCase.execute(USER_FIXTURE_2)

      const found1 = await findByEmailUseCase.execute(USER_FIXTURE.email)
      const found2 = await findByEmailUseCase.execute(USER_FIXTURE_2.email)

      expect(found1.id).toBe(user1.id)
      expect(found2.id).toBe(user2.id)
      expect(found1.id).not.toBe(found2.id)

      const list = await listUseCase.execute(0, 10)
      expect(list).toHaveLength(2)
    })

    it('prevents duplicate emails on registration', async () => {
      const registerUseCase = new RegisterUserUseCase(repository)

      await registerUseCase.execute(USER_FIXTURE)
      await expect(registerUseCase.execute(USER_FIXTURE)).rejects.toThrow('User already exists')
    })

    it('supports pagination on list', async () => {
      const registerUseCase = new RegisterUserUseCase(repository)
      const listUseCase = new ListUsersUseCase(repository)

      for (let i = 0; i < 5; i++) {
        await registerUseCase.execute({
          ...USER_FIXTURE,
          email: `user${i}@test.com`
        })
      }

      const page1 = await listUseCase.execute(0, 2)
      const page2 = await listUseCase.execute(2, 2)
      const page3 = await listUseCase.execute(4, 2)

      expect(page1).toHaveLength(2)
      expect(page2).toHaveLength(2)
      expect(page3).toHaveLength(1)
    })
  })
})
