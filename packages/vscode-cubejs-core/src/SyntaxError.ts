import {Position} from "@vscode-cubejs/parser/src/Tokenizer";

export class SyntaxError extends Error {
  constructor(public readonly pos: Position, public readonly message: string) {
    super(message);
    this.name = 'SyntaxError';
  }

  public override toString(): string {
    return `[SyntaxError] \nname: ${this.name} \nposition: ${this.pos.index} \nmessage: ${this.message}`;
  }
}
