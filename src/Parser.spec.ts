import {AstNode, ExpressionNode, ExpressionStatementNode, NodeTypes, Parser} from "./Parser";
import {Token, Tokenizer, TokenTypes} from "./Tokenizer";

function prettyLog(obj: {}) {
  console.log(JSON.stringify(obj, null, 2));
}

describe('parser', () => {

  it('for manual test', () => {
    const parser = new Parser();
    const ast = parser.parse(`
        y = (2+3) * 3;
    `);
    prettyLog(ast);
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
    }));
  });

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
