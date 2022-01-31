import {Position} from "./Tokenizer";

export class SyntaxError extends Error {
  constructor(public readonly pos: Position, public readonly message: string) {
    super(message);
    this.name = 'SyntaxError';
  }
}
