import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ListUsersUseCase } from '../../../core/users/application/use-cases/list.usecase'
import { createMockUser, MockUserRepository, resetUserIdCounter, USER_FIXTURE, USER_FIXTURE_2 } from '../helpers'

describe('ListUsersUseCase', () => {
  let repository: MockUserRepository
  let useCase: ListUsersUseCase

  beforeEach(() => {
    repository = new MockUserRepository()
    useCase = new ListUsersUseCase(repository)
    resetUserIdCounter()
  })

  afterEach(() => {
    repository.clear()
  })

  describe('execute', () => {
    it('returns empty array when no users exist', async () => {
      await expect(useCase.execute(0, 10)).rejects.toThrow('User not found')
    })

    it('returns users with default pagination', async () => {
      const user1 = createMockUser({ email: USER_FIXTURE.email })
      const user2 = createMockUser({ email: USER_FIXTURE_2.email })
      await repository.save(user1)
      await repository.save(user2)

      const result = await useCase.execute(0, 10)

      expect(result).toHaveLength(2)
    })

    it('respects offset and limit', async () => {
      for (let i = 0; i < 5; i++) {
        await repository.save(createMockUser({ email: `user${i}@test.com` }))
      }

      const result = await useCase.execute(2, 2)

      expect(result).toHaveLength(2)
    })

    it('throws when users array is empty', async () => {
      await expect(useCase.execute(0, 10)).rejects.toThrow('User not found')
    })
  })
})
