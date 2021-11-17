export enum TokenTypes {
  Number = 'Number',
  String = 'String',
  Identifier = 'Identifier',

  Semicolon = ';',
  CurlyBracketOpen = '{',
  CurlyBracketClose = '}',

  RoundBracketOpen = '(',
  RoundBracketClose = ')',

  Whitespace = 'Whitespace',
  AdditiveOperator = 'AdditiveOperator',
}

const Spec: Array<[RegExp, TokenTypes]> = [
  [/^\s/, TokenTypes.Whitespace],
  [/^\/\/.*/, TokenTypes.Whitespace],
  [/^\/\*[\s\S]*?\*\//, TokenTypes.Whitespace],

  [/^[\+\-\*]/, TokenTypes.AdditiveOperator],

  [/^{/, TokenTypes.CurlyBracketOpen],
  [/^}/, TokenTypes.CurlyBracketClose],

  [/^\(/, TokenTypes.RoundBracketOpen],
  [/^\)/, TokenTypes.RoundBracketClose],

  [/^;/, TokenTypes.Semicolon],

  [/^\w+/, TokenTypes.Identifier],

  [/^\d+/, TokenTypes.Number],

  [/^"[^"]*"/, TokenTypes.String],
  [/^'[^']*'/, TokenTypes.String],
]

export class Token {
  constructor(
    public readonly type: TokenTypes,
    public readonly value: string
  ) { }
}

export class Tokenizer {
  private _cursor = 0;
  private _string = "";

  init(string: string) {
    this._string = string;
    this._cursor = 0;
  }

  hasMoreTokens(): boolean {
    return this._cursor < this._string.length;
  }

  getNextToken(): Token | null {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const content = this._string.slice(this._cursor);

    for (const [regex, tokenType] of Spec) {
      const tokenValue = this._match(regex, content);
      if (!tokenValue) {
        continue;
      }

      if (tokenType === TokenTypes.Whitespace) {
        return this.getNextToken();
      }

      return new Token(tokenType, tokenValue);
    }

    // TODO: add position to recover
    throw new SyntaxError(`Unexpected token: "${content[0]}"`);
  }

  isEOF(): Boolean {
    return this._string.length === this._cursor;
  }

  private _match(regex: RegExp, content: string): string | null {
    const matched = regex.exec(content);
    if (!matched) {
      return null;
    }

    this._cursor += matched[0].length
    return matched[0];
  }
}
