import { afterEach, describe, expect, it } from 'vitest'
import { FindByEmailUseCase } from '../../../features/users/application/use-cases/find-by-email.usecase'
import { createMockUser, MockUserRepository, USER_FIXTURE } from '../helpers'

describe('FindByEmailUseCase', () => {
  const repository = new MockUserRepository()
  const useCase = new FindByEmailUseCase(repository)

  afterEach(() => {
    repository.clear()
  })

  describe('execute', () => {
    it('returns user when email exists', async () => {
      const user = createMockUser({ email: USER_FIXTURE.email })
      await repository.save(user)

      const result = await useCase.execute(USER_FIXTURE.email)

      expect(result.email).toBe(USER_FIXTURE.email)
    })

    it('throws UserNotFoundError when email not found', async () => {
      await expect(useCase.execute('nonexistent@example.com')).rejects.toThrow('User not found')
    })
  })
})
