import { afterEach, describe, expect, it } from 'vitest'
import { UpdateUserUseCase } from '../../../core/users/application/use-cases/update.usecase'
import { createMockUser, MockUserRepository, UPDATE_FIXTURE } from '../helpers'

describe('UpdateUserUseCase', () => {
  const repository = new MockUserRepository()
  const useCase = new UpdateUserUseCase(repository)

  afterEach(() => {
    repository.clear()
  })

  describe('execute', () => {
    it('updates user with valid data', async () => {
      const user = createMockUser()
      await repository.save(user)

      const result = await useCase.execute(user.id, UPDATE_FIXTURE)

      expect(result.firstName).toBe(UPDATE_FIXTURE.firstName)
      expect(result.city).toBe(UPDATE_FIXTURE.city)
    })

    it('throws UserNotFoundError when user not found', async () => {
      await expect(useCase.execute('non-existent-id', UPDATE_FIXTURE)).rejects.toThrow('User not found')
    })

    it('preserves unchanged fields', async () => {
      const user = createMockUser()
      await repository.save(user)

      const result = await useCase.execute(user.id, UPDATE_FIXTURE)

      expect(result.lastName).toBe(user.lastName)
      expect(result.email).toBe(user.email)
      expect(result.province).toBe(user.province)
    })

    it('updates updatedAt timestamp', async () => {
      const user = createMockUser()
      await repository.save(user)

      const result = await useCase.execute(user.id, UPDATE_FIXTURE)

      expect(result.updatedAt.getTime()).toBeGreaterThanOrEqual(user.updatedAt.getTime())
    })
  })
})
