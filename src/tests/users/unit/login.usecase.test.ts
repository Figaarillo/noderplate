import { afterEach, describe, expect, it, vi } from 'vitest'
import { LoginUserUseCase } from '../../../core/users/application/use-cases/login.usecase'
import { createMockUser, MockUserRepository, LOGIN_FIXTURE } from '../helpers'

vi.mock('argon2', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashedpassword'),
    verify: vi.fn().mockImplementation(async (hash: string, password: string) => {
      if (password === LOGIN_FIXTURE.password && hash === 'hashedpassword') {
        return await Promise.resolve(true)
      }
      return await Promise.resolve(false)
    })
  }
}))

describe('LoginUserUseCase', () => {
  const repository = new MockUserRepository()
  const useCase = new LoginUserUseCase(repository)

  afterEach(() => {
    repository.clear()
  })

  describe('execute', () => {
    it('returns user when credentials are valid', async () => {
      const user = createMockUser({ email: LOGIN_FIXTURE.email, password: 'hashedpassword' })
      await repository.save(user)

      const result = await useCase.execute(LOGIN_FIXTURE)

      expect(result.email).toBe(LOGIN_FIXTURE.email)
    })

    it('throws InvalidCredentialsError when email not found', async () => {
      await expect(useCase.execute(LOGIN_FIXTURE)).rejects.toThrow('Invalid credentials provided')
    })

    it('throws InvalidCredentialsError when password is wrong', async () => {
      const user = createMockUser({ email: LOGIN_FIXTURE.email, password: 'wronghash' })
      await repository.save(user)

      await expect(useCase.execute(LOGIN_FIXTURE)).rejects.toThrow('Invalid credentials provided')
    })
  })
})
