export enum TokenTypes {
  Number = 'Number',
  String = 'String',
  Identifier = 'Identifier',
  FunctionKeyword = 'FunctionKeyword',

  // cubes
  CubeKeyword = 'CubeKeyword',
  MeasuresKeyword = 'MeasuresKeyword',
  DimensionsKeyword = 'DimensionsKeyword',

  LetKeyword = 'LetKeyword',
  ConstKeyword = 'ConstKeyword',
  VarKeyword = 'VarKeyword',
  ReturnKeyword = 'ReturnKeyword',

  SimpleAssignmentOperator = 'SimpleAssignmentOperator',
  ComplexAssignmentOperator = 'ComplexAssignmentOperator',

  Spread = '...',
  Colon = ':',
  Semicolon = ';',
  CurlyBracketOpen = '{',
  CurlyBracketClose = '}',

  RoundBracketOpen = '(',
  RoundBracketClose = ')',

  SquareBracketOpen = '[',
  SquareBracketClose = ']',

  LineBreak = 'LineBreak',
  Whitespace = 'Whitespace',
  AdditiveOperator = 'AdditiveOperator',
  Comma = 'Comma',
  Dot = '.',
}

const Spec: Array<[RegExp, TokenTypes]> = [
  [/^[\n\r]/, TokenTypes.LineBreak],
  [/^\s/, TokenTypes.Whitespace],
  [/^\/\/.*/, TokenTypes.Whitespace],
  [/^\/\*[\s\S]*?\*\//, TokenTypes.Whitespace],

  // cube
  [/^cube/, TokenTypes.CubeKeyword],
  [/^measures/, TokenTypes.MeasuresKeyword],
  [/^dimensions/, TokenTypes.DimensionsKeyword],


  [/^function/, TokenTypes.FunctionKeyword],
  [/^return/, TokenTypes.ReturnKeyword],

  [/^{/, TokenTypes.CurlyBracketOpen],
  [/^}/, TokenTypes.CurlyBracketClose],

  [/^\(/, TokenTypes.RoundBracketOpen],
  [/^\)/, TokenTypes.RoundBracketClose],

  [/^\[/, TokenTypes.SquareBracketOpen],
  [/^\]/, TokenTypes.SquareBracketClose],

  [/^=/, TokenTypes.SimpleAssignmentOperator],
  [/^[\*\+\-\/\%]=/, TokenTypes.ComplexAssignmentOperator],
  [/^[\+\-\*\/\%]/, TokenTypes.AdditiveOperator],

  [/^\.\.\./, TokenTypes.Spread],
  [/^\./, TokenTypes.Dot],
  [/^\:/, TokenTypes.Colon],
  [/^;/, TokenTypes.Semicolon],
  [/^,/, TokenTypes.Comma],

  [/^let/, TokenTypes.LetKeyword],
  [/^const/, TokenTypes.ConstKeyword],
  [/^var/, TokenTypes.VarKeyword],

  [/^\d+/, TokenTypes.Number],
  [/^\w+/, TokenTypes.Identifier],

  [/^"[^"]*"/, TokenTypes.String],
  [/^'[^']*'/, TokenTypes.String],
]

export class Position {
  constructor(index: number) { }
}

export class Token {

  constructor(
    public readonly type: TokenTypes,
    public readonly value: string
  ) {
  }
}

export class Tokenizer {
  public cursor = 0;
  public get currentPosition(): Position {
    return new Position(this.cursor);
  }
  private _string = "";


  init(string: string) {
    this._string = string;
    this.cursor = 0;
  }

  hasMoreTokens(): boolean {
    return this.cursor < this._string.length;
  }

  getNextToken(): Token | null {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const content = this._string.slice(this.cursor);

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
    return this._string.length === this.cursor;
  }

  private _match(regex: RegExp, content: string): string | null {
    const matched = regex.exec(content);
    if (!matched) {
      return null;
    }

    this.cursor += matched[0].length
    return matched[0];
  }
}
