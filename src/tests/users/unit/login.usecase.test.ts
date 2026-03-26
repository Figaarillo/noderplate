import { afterEach, describe, expect, it } from 'vitest'
import { LoginUserUseCase } from '../../../core/users/application/use-cases/login.usecase'
import { createMockUser, MockUserRepository, LOGIN_FIXTURE } from '../helpers'

describe('LoginUserUseCase', () => {
  const repository = new MockUserRepository()
  const useCase = new LoginUserUseCase(repository)

  afterEach(() => {
    repository.clear()
  })

  describe('execute', () => {
    it('returns user when credentials are valid', async () => {
      const user = createMockUser({ email: LOGIN_FIXTURE.email, password: LOGIN_FIXTURE.password })
      await repository.save(user)

      const result = await useCase.execute(LOGIN_FIXTURE)

      expect(result.email).toBe(LOGIN_FIXTURE.email)
    })

    it('throws InvalidCredentialsError when email not found', async () => {
      await expect(useCase.execute(LOGIN_FIXTURE)).rejects.toThrow('Invalid credentials provided')
    })

    it('throws InvalidCredentialsError when password is wrong', async () => {
      const user = createMockUser({ email: LOGIN_FIXTURE.email, password: 'wrongpassword' })
      await repository.save(user)

      await expect(useCase.execute(LOGIN_FIXTURE)).rejects.toThrow('Invalid credentials provided')
    })
  })
})
