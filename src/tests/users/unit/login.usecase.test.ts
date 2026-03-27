import { afterEach, describe, expect, it } from 'vitest'
import { LoginUserUseCase } from '../../../core/users/application/use-cases/login.usecase'
import { createMockUser, MockUserRepository, MockHashProvider, MockTokenProvider, LOGIN_FIXTURE } from '../helpers'

describe('LoginUserUseCase', () => {
  const repository = new MockUserRepository()
  const hashProvider = new MockHashProvider()
  const tokenProvider = new MockTokenProvider()
  const useCase = new LoginUserUseCase(repository, hashProvider, tokenProvider)

  afterEach(() => {
    repository.clear()
  })

  describe('execute', () => {
    it('returns user and tokens when credentials are valid', async () => {
      const hashedPassword = await hashProvider.hash(LOGIN_FIXTURE.password)
      const user = createMockUser({ email: LOGIN_FIXTURE.email, password: hashedPassword })
      await repository.save(user)

      const result = await useCase.execute(LOGIN_FIXTURE)

      expect(result.user.email).toBe(LOGIN_FIXTURE.email)
      expect(result.tokens.accessToken).toBeDefined()
      expect(result.tokens.refreshToken).toBeDefined()
    })

    it('throws InvalidCredentialsError when email not found', async () => {
      await expect(useCase.execute(LOGIN_FIXTURE)).rejects.toThrow('Invalid credentials provided')
    })

    it('throws InvalidCredentialsError when password is wrong', async () => {
      const hashedPassword = await hashProvider.hash('correctpassword')
      const user = createMockUser({ email: LOGIN_FIXTURE.email, password: hashedPassword })
      await repository.save(user)

      await expect(useCase.execute(LOGIN_FIXTURE)).rejects.toThrow('Invalid credentials provided')
    })
  })
})
