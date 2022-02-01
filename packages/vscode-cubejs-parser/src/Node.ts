import { toPlainObject } from "./utils";
import {Token} from "./Tokenizer";

export enum NodeTypes {
  Program = 'Program',
  NumericLiteral = 'NumericLiteral',
  StringLiteral = 'StringLiteral',
  ExpressionStatement = 'ExpressionStatement',
  ObjectDeclaration = 'ObjectDeclaration',
  ObjectPropertyDeclaration = 'ObjectPropertyDeclaration',
  ObjectDestructuringPropertyDeclaration = 'ObjectDestructuringPropertyDeclaration',
  BlockStatement = 'BlockStatement',
  ReturnStatement = 'ReturnStatement',
  EmptyExpression = "EmptyExpression",
  EOFLiteral = 'EOFLiteral',
  Expression = "Expression",
  UnaryExpression = 'UnaryExpression',
  Identifier = "Identifier",
  VariableStatement = 'VariableStatement',
  VariableDeclaration = 'VariableDeclaration',
  FunctionDeclaration = 'FunctionDeclaration',
  FunctionCallExpression = 'FunctionCallExpression',

  InvalidNode = "InvalidNode",
}

export class AstNode {
  public readonly type: NodeTypes;
  public body?: AstNode[];
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

  toPlainObject() {
    return toPlainObject(this);
  }
}

export class ExpressionNode extends AstNode {
  constructor(public readonly operator: Token, public left: AstNode, public right: AstNode) {
    super({type: NodeTypes.Expression});
  }
}

export class UnaryExpressionNode extends AstNode {
  constructor(public readonly operator: Token, public init: AstNode) {
    super({type: NodeTypes.UnaryExpression});
  }
}

export class VariableNode extends AstNode {
  constructor(public readonly name: string, public init?: AstNode) {
    super({type: NodeTypes.VariableDeclaration});
  }
}

export class ObjectPropertyDeclarationNode extends AstNode {
  public init?: AstNode;
  public name?: string;

  constructor(options: {
    name?: string,
    init?: AstNode,
  }) {
    super({type: NodeTypes.ObjectPropertyDeclaration});
    this.name = options.name;
    this.init = options.init;
  }
}

export class ObjectDestructuringPropertyDeclarationNode extends AstNode {
  constructor(public name: string, public alias?: string) {
    super({type: NodeTypes.ObjectDestructuringPropertyDeclaration});
  }
}

export class FunctionDeclarationNode extends AstNode {
  public name: string;
  public params?: AstNode[];

  constructor(options: {name: string, body: AstNode[], params?: AstNode[]}) {
    super({type: NodeTypes.FunctionDeclaration});
    this.name = options.name;
    this.body = options.body;
    this.params = options.params;
  }
}

export class FunctionCallExpressionNode extends AstNode {
  constructor(public name: string, public params?: AstNode[]) {
    super({type: NodeTypes.FunctionCallExpression});
  }
}
