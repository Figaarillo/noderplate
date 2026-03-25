import { afterEach, describe, expect, it } from 'vitest'
import { RegisterUserUseCase } from '../../../core/users/application/use-cases/register.usecase'
import { createMockUser, MockUserRepository, USER_FIXTURE } from '../helpers'

describe('RegisterUserUseCase', () => {
  const repository = new MockUserRepository()
  const useCase = new RegisterUserUseCase(repository)

  afterEach(() => {
    repository.clear()
  })

  describe('execute', () => {
    it('creates a new user with valid data', async () => {
      const result = await useCase.execute(USER_FIXTURE)

      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.email).toBe(USER_FIXTURE.email)
      expect(result.firstName).toBe(USER_FIXTURE.firstName)
      expect(result.lastName).toBe(USER_FIXTURE.lastName)
      expect(result.role).toBe('user')
    })

    it('uses custom role when provided', async () => {
      const result = await useCase.execute({ ...USER_FIXTURE, role: 'admin' })

      expect(result.role).toBe('admin')
    })

    it('throws error when email already exists', async () => {
      await repository.save(createMockUser({ email: USER_FIXTURE.email }))

      await expect(useCase.execute(USER_FIXTURE)).rejects.toThrow('User already exists')
    })

    it('generates unique id for each user', async () => {
      const user1 = await useCase.execute(USER_FIXTURE)
      const user2 = await useCase.execute({ ...USER_FIXTURE, email: 'another@example.com' })

      expect(user1.id).not.toBe(user2.id)
    })

    it('sets createdAt and updatedAt timestamps', async () => {
      const result = await useCase.execute(USER_FIXTURE)

      expect(result.createdAt).toBeInstanceOf(Date)
      expect(result.updatedAt).toBeInstanceOf(Date)
    })
  })
})
