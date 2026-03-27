import { afterEach, describe, expect, it } from 'vitest'
import { DeleteUserUseCase } from '../../../core/users/application/use-cases/delete.usecase'
import { createMockUser, MockUserRepository } from '../helpers'

describe('DeleteUserUseCase', () => {
  const repository = new MockUserRepository()
  const useCase = new DeleteUserUseCase(repository)

  afterEach(() => {
    repository.clear()
  })

  describe('execute', () => {
    it('deletes an existing user', async () => {
      const user = createMockUser()
      await repository.save(user)

      await expect(useCase.execute(user.id)).resolves.toBeUndefined()
    })

    it('throws when deleting non-existent user', async () => {
      await expect(useCase.execute('non-existent-id')).rejects.toThrow('not found')
    })

    it('removes user from repository', async () => {
      const user = createMockUser()
      await repository.save(user)

      await useCase.execute(user.id)

      const found = await repository.findById(user.id)
      expect(found).toBeNull()
    })
  })
})
