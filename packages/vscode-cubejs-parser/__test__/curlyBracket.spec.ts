import {AstNode, NodeTypes, Parser} from "../src/Parser";

describe('curlyBracket', () => {
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
});
