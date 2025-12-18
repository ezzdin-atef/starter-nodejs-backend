export class Password {
  constructor(
    public readonly userId: string,
    public readonly hash: string
  ) {}
}

