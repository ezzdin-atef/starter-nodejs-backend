export class PasswordResetToken {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly used: boolean = false,
    public readonly createdAt?: Date
  ) {}

  isExpired(): boolean {
    return this.expiresAt < new Date()
  }

  isValid(): boolean {
    return !this.used && !this.isExpired()
  }
}

