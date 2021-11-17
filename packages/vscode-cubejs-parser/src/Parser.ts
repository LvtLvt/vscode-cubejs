import {Token, Tokenizer, TokenTypes} from './Tokenizer';
import * as assert from "assert";
import {SyntaxError} from './SyntaxError';


export enum NodeTypes {
  Program = 'Program',
  NumericLiteral = 'NumericLiteral',
  StringLiteral = 'StringLiteral',
  ExpressionStatement = 'ExpressionStatement',
  BlockStatement = 'BlockStatement',
  EmptyExpression = "EmptyExpression",
  Expression = "Expression",
  Identifier = "Identifier",
}

export class AstNode {
  public readonly type: NodeTypes;
  public readonly body?: AstNode[];
  public readonly value?: any;

  constructor(options: {
    type: NodeTypes;
    body?: AstNode[];
    value?: any;
  }) {
    this.type = options.type;
    this.value = options.value;
    this.body = options.body;
  }
}

export class ExpressionStatementNode extends AstNode {
  constructor(public expression: AstNode) {
    super({type: NodeTypes.ExpressionStatement});
  }
}

export class ExpressionNode extends AstNode {
  constructor(public readonly operator: Token, public left: AstNode, public right: AstNode) {
    super({type: NodeTypes.Expression});
  }
}

export class Parser {
  private _content = "";
  private _lookahead: Token | null = null;
  private readonly _tokenizer = new Tokenizer();

  parse(content: string) {
    this._content = content;
    this._tokenizer.init(this._content);
    this._lookahead = this._tokenizer.getNextToken();

    assert(this._lookahead);

    return this.Program();
  }

  private _eat(tokenType: TokenTypes): Token {
    const token = this._lookahead;

    if (!token) {
      throw new SyntaxError(`Unexpected end of input, but expected: ${tokenType}`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(`Unexpected token: "${token.value}", expected: ${tokenType}`);
    }

    this._lookahead = this._tokenizer.getNextToken();

    return token;
  }

  Program(): AstNode {
    return new AstNode({
      type: NodeTypes.Program,
      body: this.StatementList(),
    });
  }

  private StatementList(skipLookAheadType: TokenTypes | null = null): AstNode[] {
    const statementList = [this.Statement()];

    while (this._lookahead && this._lookahead.type !== skipLookAheadType) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  private Statement(): AstNode {
    switch (this._lookahead?.type) {
      case TokenTypes.Semicolon: return this.EmptyStatement();
      case TokenTypes.CurlyBracketOpen: return this.BlockStatement();
      default: return this.ExpressionStatement();
    }
  }

  private EmptyStatement(): AstNode {
    this._eat(TokenTypes.Semicolon);
    return new AstNode({type: NodeTypes.EmptyExpression, value: ''});
  }

  private BlockStatement(): AstNode {
    this._eat(TokenTypes.CurlyBracketOpen);
    const body = this._lookahead?.type !== TokenTypes.CurlyBracketClose ? this.StatementList(TokenTypes.CurlyBracketClose) : [];

    this._eat(TokenTypes.CurlyBracketClose);

    return new AstNode({
      type: NodeTypes.BlockStatement,
      body,
    })
  }

  private ExpressionStatement(): AstNode {
    const expression = this.Expression();
    this._eat(TokenTypes.Semicolon);
    return expression;
  }

  private Expression(): AstNode {
    return this.AssignmentExpression();
  }

  private AssignmentExpression(): AstNode {
    let left = this.AdditiveExpression();

    if (this._lookahead !== null && this.isAssignmentOperator(this._lookahead)) {
      const token = this._eat(this._lookahead.type);
      return new ExpressionNode(
        new Token(token.type, token.value),
        left,
        this.AssignmentExpression(),
      )
    }

    return left;
  }

  private AdditiveExpression(): AstNode {
    let left: AstNode = this.PrimaryExpression();

    while (this._lookahead?.type === TokenTypes.AdditiveOperator) {
      const operator = this._eat(TokenTypes.AdditiveOperator);
      const right = this.PrimaryExpression();

      left = new ExpressionNode(operator, left, right);
    }

    return left;
  }

  private PrimaryExpression(): AstNode {
    switch (this._lookahead?.type) {
      case TokenTypes.RoundBracketOpen: return this.ParenthesizedExpression();
      case TokenTypes.Identifier: return this.Identifier();
      default: return this.Literal();
    }
  }

  private ParenthesizedExpression(): AstNode {
    this._eat(TokenTypes.RoundBracketOpen);
    const expression = this.Expression();
    this._eat(TokenTypes.RoundBracketClose);
    return expression;
  }

  private NumericLiteral(): AstNode {
    const token = this._eat(TokenTypes.Number);
    return new AstNode({
      type: NodeTypes.NumericLiteral,
      value: Number(token.value),
    });
  }

  private Identifier() {
    const token = this._eat(TokenTypes.Identifier);
    return new AstNode({
      type: NodeTypes.Identifier,
      value: token.value,
    })
  }

  private StringLiteral(): AstNode {
    const token = this._eat(TokenTypes.String);
    return new AstNode({
      type: NodeTypes.StringLiteral,
      value: token.value.slice(1, -1),
    })
  }

  private Literal() {
    switch (this._lookahead?.type) {
      case TokenTypes.Number: return this.NumericLiteral();
      case TokenTypes.String: return this.StringLiteral();

      default: throw new SyntaxError(`Literal: unexpected literal production tokenType: [${this._lookahead?.type}] tokenValue: [${this._lookahead?.value}]`);
    }
  }

  private isAssignmentOperator(token: Token) {
    return token.type === TokenTypes.SimpleAssignmentOperator ||
      token.type === TokenTypes.ComplexAssignmentOperator;
  }
}