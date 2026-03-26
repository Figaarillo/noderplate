import { afterEach, describe, expect, it } from 'vitest'
import { FindByIdUseCase } from '../../../core/users/application/use-cases/find-by-id.usecase'
import { createMockUser, MockUserRepository } from '../helpers'

describe('FindByIdUseCase', () => {
  const repository = new MockUserRepository()
  const useCase = new FindByIdUseCase(repository)

  afterEach(() => {
    repository.clear()
  })

  describe('execute', () => {
    it('returns user when found', async () => {
      const user = createMockUser()
      await repository.save(user)

      const result = await useCase.execute(user.id)

      expect(result).toEqual(user)
    })

    it('throws UserNotFoundError when user not found', async () => {
      await expect(useCase.execute('non-existent-id')).rejects.toThrow('User not found')
    })
  })
})
