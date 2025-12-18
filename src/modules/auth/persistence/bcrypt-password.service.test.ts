import { describe, it, expect, beforeEach } from '@jest/globals'
import { BcryptPasswordService } from './bcrypt-password.service'

describe('BcryptPasswordService', () => {
  let passwordService: BcryptPasswordService

  beforeEach(() => {
    passwordService = new BcryptPasswordService()
  })

  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'password123'
      const hash = await passwordService.hash(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(0)
    })

    it('should produce different hashes for the same password', async () => {
      const password = 'password123'
      const hash1 = await passwordService.hash(password)
      const hash2 = await passwordService.hash(password)

      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verify', () => {
    it('should verify a correct password', async () => {
      const password = 'password123'
      const hash = await passwordService.hash(password)

      const isValid = await passwordService.verify(password, hash)

      expect(isValid).toBe(true)
    })

    it('should reject an incorrect password', async () => {
      const password = 'password123'
      const wrongPassword = 'wrong-password'
      const hash = await passwordService.hash(password)

      const isValid = await passwordService.verify(wrongPassword, hash)

      expect(isValid).toBe(false)
    })
  })
})

