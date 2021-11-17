import {AstNode, BinaryExpressionNode, ExpressionStatementNode, NodeTypes, Parser} from "./Parser";
import {Token, Tokenizer, TokenTypes} from "./Tokenizer";

describe('parser', () => {

  it('for manual test', () => {
    const parser = new Parser();
    const ast = parser.parse(`
        y = (2+3) * 3;
    `);
    console.log(JSON.stringify(ast, null, 2));
  })

  it('simple curlyBracket', () => {
    const parser = new Parser();
    const ast = parser.parse('/**hello world*/   {"   abc";}');

    expect(ast).toStrictEqual(new AstNode({
      type: NodeTypes.Program,
      body: [
        new AstNode({
          type: NodeTypes.BlockStatement,
          body: [new AstNode({type: NodeTypes.StringLiteral, value: "   abc"})]
        })
      ],
    }))
  });

  it('simple binary expression', () => {
    const parser = new Parser();
    const ast = parser.parse('{(1+2)+3;}');

    console.log(JSON.stringify(ast, null, 2));
    expect(ast).toStrictEqual(new AstNode({
      type: NodeTypes.Program,
      body: [
        new AstNode({
          type: NodeTypes.BlockStatement,
          body: [
              new BinaryExpressionNode( new Token(TokenTypes.AdditiveOperator, '+'),
                new BinaryExpressionNode(
                  new Token(TokenTypes.AdditiveOperator, '+'),
                  new AstNode({type: NodeTypes.NumericLiteral, value: 1}),
                  new AstNode({type: NodeTypes.NumericLiteral, value: 2}),
                ),
                new AstNode({type: NodeTypes.NumericLiteral, value: 3})
              ),
          ]
        })
      ],
    }))
  });
});

describe('tokenizer', () => {
  it('should return token', () => {
    const tokenizer = new Tokenizer();
    tokenizer.init('123');
    const nextToken = tokenizer.getNextToken();
    expect(nextToken).not.toBeNull();
  });
});

// new AstNode({type: NodeTypes.EmptyExpression, value: ""}),
//   new ExpressionStatementNode(new AstNode({type: NodeTypes.NumericLiteral, value: '123'})),
//   new ExpressionStatementNode(
//     new BinaryExpressionNode(
//       new Token(TokenTypes.AdditiveOperator, '+'),
//       new AstNode({type: NodeTypes.NumericLiteral, value: })
// ],
