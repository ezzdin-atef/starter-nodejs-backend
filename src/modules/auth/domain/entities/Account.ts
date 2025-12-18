export enum AuthProvider {
  EMAIL = 'EMAIL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  APPLE = 'APPLE',
  GITHUB = 'GITHUB'
}

export class Account {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly provider: AuthProvider,
    public readonly providerAccountId: string,
    public readonly accessToken?: string,
    public readonly refreshToken?: string,
    public readonly expiresAt?: number
  ) {}
}

