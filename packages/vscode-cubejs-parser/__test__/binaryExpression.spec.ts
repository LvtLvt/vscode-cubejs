import {AstNode, ExpressionNode, NodeTypes, Parser} from "../src/Parser";
import {Token, TokenTypes} from "../src/Tokenizer";

describe('binary expression', () => {
  it('simple binary expression', () => {
    const parser = new Parser();
    const ast = parser.parse('{(1+2)+3;}');

    expect(ast).toStrictEqual(new AstNode({
      type: NodeTypes.Program,
      body: [
        new AstNode({
          type: NodeTypes.BlockStatement,
          body: [
            new ExpressionNode( new Token(TokenTypes.AdditiveOperator, '+'),
              new ExpressionNode(
                new Token(TokenTypes.AdditiveOperator, '+'),
                new AstNode({type: NodeTypes.NumericLiteral, value: 1}),
                new AstNode({type: NodeTypes.NumericLiteral, value: 2}),
              ),
              new AstNode({type: NodeTypes.NumericLiteral, value: 3})
            ),
          ]
        })
      ],
    }));
  });
});
