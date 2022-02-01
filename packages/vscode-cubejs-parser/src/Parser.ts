import {Token, Tokenizer, TokenTypes} from './Tokenizer';
import * as assert from "assert";
import {SyntaxError} from '@vscode-cubejs/core/src/SyntaxError';
import {
  AstNode,
  ExpressionNode,
  FunctionCallExpressionNode,
  FunctionDeclarationNode,
  NodeTypes,
  ObjectDestructuringPropertyDeclarationNode,
  ObjectPropertyDeclarationNode,
  UnaryExpressionNode,
  VariableNode
} from "./Node";
import {Cube} from "@vscode-cubejs/core/lib";

export class Parser {
  private _content = "";
  private _lookahead: Token | null = null;
  private cubes: Map<string, Cube> = new Map<string, Cube>();
  private readonly _tokenizer = new Tokenizer();
  public errorList: SyntaxError[] = [];

  parse(content: string) {
    this._content = content;
    this._tokenizer.init(this._content);
    this._lookahead = this._tokenizer.getNextToken();

    assert(this._lookahead);

    return this.Program();
  }

  Program(): AstNode {
    return new AstNode({
      type: NodeTypes.Program,
      body: this.StatementList(),
    });
  }

  private StatementList(skipLookAheadType: TokenTypes | null = null): AstNode[] {
    const statementList = [];

    do {
      if (this.eatIfLineBreak()) {
        continue;
      }

      statementList.push(this.Statement());
    } while (this._lookahead && this._lookahead.type !== skipLookAheadType && !this._tokenizer.isEOF());

    return statementList;
  }

  private Statement(): AstNode {
    switch (this._lookahead?.type) {
      case TokenTypes.Semicolon: return this.EmptyStatement();
      case TokenTypes.CurlyBracketOpen: return this.BlockStatement();
      // decl [START]
      case TokenTypes.LetKeyword:
      case TokenTypes.VarKeyword:
      case TokenTypes.ConstKeyword: return this.VariableStatement();
      // decl [END]
      case TokenTypes.ReturnKeyword: return this.ReturnStatement();
      case TokenTypes.FunctionKeyword: return this.FunctionStatement();
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
    });
  }

  private ReturnStatement() {
    this._eat(TokenTypes.ReturnKeyword);
    return new AstNode({
      type: NodeTypes.ReturnStatement,
      value: this.AdditiveExpression(),
    })
  }

  private VariableStatement(): AstNode {
    let keyword = this._eat(this._lookahead?.type!!);

    const variables: AstNode[] = [];
    do {
      if (this.eatIfLineBreak()) {
        continue;
      }
      variables.push(this.VariableExpression());
    } while (this._lookahead?.type === TokenTypes.Comma && this._eat(TokenTypes.Comma) && !this._tokenizer.isEOF())

    this.eatEndOfExpression();

    return new AstNode({
      type: NodeTypes.VariableStatement,
      value: keyword,
      body: variables,
    })
  }

  private ExpressionStatement(): AstNode {
    const expression = this.Expression();

    this.eatEndOfExpression();

    return expression;
  }

  private Expression(): AstNode {
    return this.AssignmentExpression();
  }

  private VariableExpression(assignmentOperator = TokenTypes.SimpleAssignmentOperator): AstNode {
    const identifier = this._eat(TokenTypes.Identifier);

    if (this._lookahead?.type === assignmentOperator) {
      this._eat(assignmentOperator);
      return new VariableNode(identifier.value, this.Expression());
    }

    return new VariableNode(identifier.value);
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

    while (this._lookahead?.type === TokenTypes.AdditiveOperator && !this._tokenizer.isEOF()) {
      const operator = this._eat(TokenTypes.AdditiveOperator);
      const right = this.PrimaryExpression();

      left = new ExpressionNode(operator, left, right);
    }

    return left;
  }

  private PrimaryExpression(): AstNode {
    switch (this._lookahead?.type) {
      case TokenTypes.RoundBracketOpen: return this.ParenthesizedExpression();
      case TokenTypes.CurlyBracketOpen: return this.ObjectDeclaration();
      case TokenTypes.Identifier: return this.CallableIdentifier();
      case TokenTypes.Spread: return this.SpreadExpression();
      default: return this.Literal();
    }
  }

  private SpreadExpression(): AstNode {
    const token = this._eat(TokenTypes.Spread);
    return new UnaryExpressionNode(token, this.AdditiveExpression());
  }

  private ParenthesizedExpression(): AstNode {
    this._eat(TokenTypes.RoundBracketOpen);
    const expression = this.Expression();
    this._eat(TokenTypes.RoundBracketClose);
    return expression;
  }

  private FunctionStatement(): AstNode {
    this._eat(TokenTypes.FunctionKeyword);
    let identifier = this.Identifier();
    this._eat(TokenTypes.RoundBracketOpen);
    let params = this.FunctionParameterList();
    this._eat(TokenTypes.RoundBracketClose);

    const body = this.BlockStatement().body || [];

    return new FunctionDeclarationNode({name: identifier.value, body, params});
  }

  private FunctionParameterList(declarationFn = this.ParameterDeclaration.bind(this)): AstNode[] {
    let params: AstNode[] = [];
    while(this._lookahead?.type !== TokenTypes.RoundBracketClose && !this._tokenizer.isEOF()) {
      const parameter = declarationFn();

      if (parameter.type === NodeTypes.InvalidNode) {
        break;
      }

      if (this._lookahead?.type === TokenTypes.Comma) {
        this._eat(TokenTypes.Comma);
      }
      params.push(parameter);
    }

    return params;
  }

  private ParameterDeclaration(): AstNode {
    switch (this._lookahead?.type) {
      case TokenTypes.Identifier: return this.Identifier();
      case TokenTypes.Spread: return this.ObjectDeclaration(true);
      case TokenTypes.CurlyBracketOpen: return this.ObjectDeclaration(false);
      default: {
        return new AstNode({type: NodeTypes.InvalidNode, value: this._lookahead?.value});
      }
    }
  }

  private ParameterDeclarationForCall(): AstNode {
    return this.AdditiveExpression();
  }

  private ObjectDeclaration(isDestructuring = false): AstNode {
    const object = new AstNode({type: NodeTypes.ObjectDeclaration});
    object.body = [];
    this._eat(TokenTypes.CurlyBracketOpen);

    while (this._lookahead?.type !== TokenTypes.CurlyBracketClose && !this._tokenizer.isEOF()) {
      if (this.eatIfLineBreak()) {
        continue;
      }
      const declaration = isDestructuring ? this.ObjectDestructuringPropertyDeclaration() : this.ObjectPropertyDeclaration();
      if (declaration.type === NodeTypes.InvalidNode) {
        continue;
      }
      object.body.push(declaration);
    }

    this._eat(TokenTypes.CurlyBracketClose);

    return object;
  }

  private ObjectDestructuringPropertyDeclaration(): AstNode {
    const identifier = this.Identifier();
    let alias;

    if (this._lookahead?.type === TokenTypes.Colon) {
      this._eat(TokenTypes.Colon);
      alias = this.Identifier().value;
    }

    if (this._lookahead?.type === TokenTypes.Comma) {
      this._eat(TokenTypes.Comma);
    }

    return new ObjectDestructuringPropertyDeclarationNode(identifier.value, alias);
  }

  private ObjectPropertyDeclaration(): AstNode {
    let property;

    switch (this._lookahead?.type) {
      case TokenTypes.Spread: {
        property = new ObjectPropertyDeclarationNode({init: this.PrimaryExpression()});
        break;
      }
      default: {
        const identifier = this.ObjectPropertyIdentifier();
        if (identifier.type === NodeTypes.InvalidNode) {
          property = identifier;
        } else if (identifier.type === NodeTypes.FunctionDeclaration) {
          const fnDecl = identifier as FunctionDeclarationNode;
          property = new ObjectPropertyDeclarationNode({name: fnDecl.name, init: fnDecl});
        } else if (this._lookahead?.type === TokenTypes.Colon) {
          this._eat(TokenTypes.Colon);
          property = new ObjectPropertyDeclarationNode({name: identifier.value, init: this.AdditiveExpression()});
        } else {
          property = new ObjectPropertyDeclarationNode({name: identifier.value});
        }
      }
    }

    if (this._lookahead?.type === TokenTypes.Comma) {
      this._eat(TokenTypes.Comma);
    }

    return property;
  }

  private ObjectPropertyIdentifier(): AstNode {
    let identifier;

    if (this._lookahead?.type === TokenTypes.SquareBracketOpen) {
      this._eat(TokenTypes.SquareBracketOpen);
      identifier = this.Identifier();
      this._eat(TokenTypes.SquareBracketClose);
    } else if (this._lookahead?.type === TokenTypes.FunctionKeyword) {
      identifier = this.FunctionStatement();
    } else {
      identifier = this.Identifier();
    }

    return identifier;
  }

  private NumericLiteral(): AstNode {
    const token = this._eat(TokenTypes.Number);
    return new AstNode({
      type: NodeTypes.NumericLiteral,
      value: Number(token.value),
    });
  }

  private CallableIdentifier(): AstNode {
    const identifier = this.Identifier();

    if (this._lookahead?.type === TokenTypes.RoundBracketOpen) {
      this._eat(TokenTypes.RoundBracketOpen);
      const params = this.FunctionParameterList(this.ParameterDeclarationForCall.bind(this));
      this._eat(TokenTypes.RoundBracketClose);
      return new FunctionCallExpressionNode(identifier.value, params);
    }

    return identifier;
  }

  private Identifier() {
    const token = this._eat(TokenTypes.Identifier);

    // for error recovery
    if (token.type !== TokenTypes.Identifier) {
      return new AstNode({type: NodeTypes.InvalidNode, value: token.value});
    }

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

      default: {
        this.errorList.push(new SyntaxError(this._tokenizer.currentPosition, `Literal: unexpected literal production tokenType: [${this._lookahead?.type}] tokenValue: [${this._lookahead?.value}]`));
        return new AstNode({type: NodeTypes.InvalidNode,value: this._lookahead?.value});
      }
    }
  }

  private eatIfLineBreak(): Token | void {
    if (this._lookahead?.type === TokenTypes.LineBreak) {
      return this._eat(TokenTypes.LineBreak);
    }
  }

  private eatEndOfExpression() {
    this._eat(this._lookahead?.type === TokenTypes.Semicolon ? TokenTypes.Semicolon : TokenTypes.LineBreak);
  }

  private isAssignmentOperator(token: Token) {
    return token.type === TokenTypes.SimpleAssignmentOperator ||
      token.type === TokenTypes.ComplexAssignmentOperator;
  }

  private _eat(tokenType: TokenTypes): Token {
    const token = this._lookahead;

    if (!token) {
      this.errorList.push(new SyntaxError(this._tokenizer.currentPosition, `Unexpected end of input, but expected: ${tokenType}`));
      return Token.NewErrorToken();
    }

    if (token.type !== tokenType) {
      this.errorList.push(new SyntaxError(this._tokenizer.currentPosition, `Unexpected token: "${token.value}", expected: ${tokenType}`));
    }

    this._lookahead = this._tokenizer.getNextToken();

    return token;
  }

}
