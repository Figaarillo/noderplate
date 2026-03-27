import { afterEach, describe, expect, it } from 'vitest'
import { RegisterUserUseCase } from '../../../core/users/application/use-cases/register.usecase'
import { createMockUser, MockUserRepository, MockHashProvider, MockAuthService, USER_FIXTURE } from '../helpers'

describe('RegisterUserUseCase', () => {
  const repository = new MockUserRepository()
  const hashProvider = new MockHashProvider()
  const authService = new MockAuthService()
  const useCase = new RegisterUserUseCase(repository, hashProvider, authService)

  afterEach(() => {
    repository.clear()
  })

  describe('execute', () => {
    it('creates a new user with valid data', async () => {
      const result = await useCase.execute(USER_FIXTURE)

      expect(result).toBeDefined()
      expect(result.user.id).toBeDefined()
      expect(result.user.email).toBe(USER_FIXTURE.email)
      expect(result.user.firstName).toBe(USER_FIXTURE.firstName)
      expect(result.user.lastName).toBe(USER_FIXTURE.lastName)
      expect(result.user.role).toBe('user')
    })

    it('uses custom role when provided', async () => {
      const result = await useCase.execute({ ...USER_FIXTURE, role: 'admin' })

      expect(result.user.role).toBe('admin')
    })

    it('throws error when email already exists', async () => {
      await repository.save(createMockUser({ email: USER_FIXTURE.email }))

      await expect(useCase.execute(USER_FIXTURE)).rejects.toThrow('User already exists')
    })

    it('generates unique id for each user', async () => {
      const user1 = await useCase.execute(USER_FIXTURE)
      const user2 = await useCase.execute({ ...USER_FIXTURE, email: 'another@example.com' })

      expect(user1.user.id).not.toBe(user2.user.id)
    })

    it('sets createdAt and updatedAt timestamps', async () => {
      const result = await useCase.execute(USER_FIXTURE)

      expect(result.user.createdAt).toBeInstanceOf(Date)
      expect(result.user.updatedAt).toBeInstanceOf(Date)
    })

    it('generates tokens on registration', async () => {
      const result = await useCase.execute(USER_FIXTURE)

      expect(result.tokens).toBeDefined()
      expect(result.tokens.accessToken).toBeDefined()
      expect(result.tokens.refreshToken).toBeDefined()
    })
  })
})
