export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name?: string,
    public readonly avatarUrl?: string,
    public readonly emailVerified?: Date,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}
}

