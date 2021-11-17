export class SyntaxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SyntaxError';
  }
}
