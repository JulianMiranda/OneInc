export class Payment {
  constructor(
    public description: string,
    public amount: number,
    public date: Date,
    public uid?: string
  ) {}
}
