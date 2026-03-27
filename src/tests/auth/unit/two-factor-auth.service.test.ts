import { describe, expect, it, vi, beforeEach } from 'vitest'
import { TwoFactorAuthService } from '../../../core/auth/application/services/two-factor-auth.service'
import { VerificationCodeType } from '../../../core/auth/domain/entities/verification-code.entity'

describe('TwoFactorAuthService', () => {
  let mockEmailProvider: any
  let mockSaveFn: any
  let mockFindFn: any

  beforeEach(() => {
    mockEmailProvider = {
      sendEmail: vi.fn().mockResolvedValue(undefined)
    }
    mockSaveFn = vi.fn().mockResolvedValue(undefined)
    mockFindFn = vi.fn().mockResolvedValue(null)
  })

  describe('sendVerificationCode', () => {
    it('should generate and send verification code', async () => {
      const service = new TwoFactorAuthService({
        emailProvider: mockEmailProvider,
        saveVerificationCode: mockSaveFn,
        findPendingVerificationCode: mockFindFn
      })

      const template = (code: string): string => `<p>Your code is ${code}</p>`

      await service.sendVerificationCode('user-123', 'test@example.com', VerificationCodeType.LOGIN, template)

      expect(mockSaveFn).toHaveBeenCalledOnce()
      expect(mockEmailProvider.sendEmail).toHaveBeenCalledOnce()

      const savedCode = mockSaveFn.mock.calls[0][0]
      expect(savedCode.code).toHaveLength(6)
      expect(savedCode.userId).toBe('user-123')
      expect(savedCode.email).toBe('test@example.com')
      expect(savedCode.type).toBe(VerificationCodeType.LOGIN)
    })

    it('should throw if pending code already exists', async () => {
      mockFindFn.mockResolvedValueOnce({
        id: 'existing-code',
        userId: 'user-123',
        code: '123456',
        type: VerificationCodeType.LOGIN,
        expiresAt: new Date(Date.now() + 600000),
        used: false,
        createdAt: new Date()
      })

      const service = new TwoFactorAuthService({
        emailProvider: mockEmailProvider,
        saveVerificationCode: mockSaveFn,
        findPendingVerificationCode: mockFindFn
      })

      const template = (code: string): string => `<p>Your code is ${code}</p>`

      await expect(
        service.sendVerificationCode('user-123', 'test@example.com', VerificationCodeType.LOGIN, template)
      ).rejects.toThrow('A verification code has already been sent')
    })
  })

  describe('verifyCode', () => {
    it('should verify valid code successfully', async () => {
      const validCode = {
        id: 'code-123',
        userId: 'user-123',
        email: 'test@example.com',
        code: '123456',
        type: VerificationCodeType.LOGIN,
        expiresAt: new Date(Date.now() + 600000),
        used: false,
        createdAt: new Date()
      }

      mockFindFn.mockResolvedValueOnce(validCode)
      mockSaveFn.mockResolvedValueOnce(undefined)

      const service = new TwoFactorAuthService({
        emailProvider: mockEmailProvider,
        saveVerificationCode: mockSaveFn,
        findPendingVerificationCode: mockFindFn
      })

      const result = await service.verifyCode('user-123', '123456', VerificationCodeType.LOGIN)

      expect(result.used).toBe(true)
      expect(mockSaveFn).toHaveBeenCalledOnce()
    })

    it('should throw if code not found', async () => {
      mockFindFn.mockResolvedValueOnce(null)

      const service = new TwoFactorAuthService({
        emailProvider: mockEmailProvider,
        saveVerificationCode: mockSaveFn,
        findPendingVerificationCode: mockFindFn
      })

      await expect(service.verifyCode('user-123', '123456', VerificationCodeType.LOGIN)).rejects.toThrow(
        'No verification code found'
      )
    })

    it('should throw if code is invalid', async () => {
      mockFindFn.mockResolvedValueOnce({
        id: 'code-123',
        userId: 'user-123',
        code: '123456',
        type: VerificationCodeType.LOGIN,
        expiresAt: new Date(Date.now() + 600000),
        used: false,
        createdAt: new Date()
      })

      const service = new TwoFactorAuthService({
        emailProvider: mockEmailProvider,
        saveVerificationCode: mockSaveFn,
        findPendingVerificationCode: mockFindFn
      })

      await expect(service.verifyCode('user-123', 'wrongcode', VerificationCodeType.LOGIN)).rejects.toThrow(
        'Invalid verification code'
      )
    })

    it('should throw if code is expired', async () => {
      mockFindFn.mockResolvedValueOnce({
        id: 'code-123',
        userId: 'user-123',
        code: '123456',
        type: VerificationCodeType.LOGIN,
        expiresAt: new Date(Date.now() - 60000),
        used: false,
        createdAt: new Date()
      })

      const service = new TwoFactorAuthService({
        emailProvider: mockEmailProvider,
        saveVerificationCode: mockSaveFn,
        findPendingVerificationCode: mockFindFn
      })

      await expect(service.verifyCode('user-123', '123456', VerificationCodeType.LOGIN)).rejects.toThrow(
        'Verification code has expired'
      )
    })

    it('should throw if code already used', async () => {
      mockFindFn.mockResolvedValueOnce({
        id: 'code-123',
        userId: 'user-123',
        code: '123456',
        type: VerificationCodeType.LOGIN,
        expiresAt: new Date(Date.now() + 600000),
        used: true,
        createdAt: new Date()
      })

      const service = new TwoFactorAuthService({
        emailProvider: mockEmailProvider,
        saveVerificationCode: mockSaveFn,
        findPendingVerificationCode: mockFindFn
      })

      await expect(service.verifyCode('user-123', '123456', VerificationCodeType.LOGIN)).rejects.toThrow(
        'Verification code has already been used'
      )
    })
  })
})
