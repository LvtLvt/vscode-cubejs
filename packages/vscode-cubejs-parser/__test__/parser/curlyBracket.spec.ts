import {Parser} from "../../src/Parser";

describe('curlyBracket', () => {
  it('simple curlyBracket', () => {
    const parser = new Parser();
    const ast = parser.parse(`
    /**hello world*/   {"   abc";}
    
    `);

    expect(ast.toPlainObject()).toMatchObject({
      "type": "Program",
      "body": [
        {
          "type": "BlockStatement",
          "body": [
            {
              "type": "StringLiteral",
              "value": "   abc"
            }
          ]
        },
      ]
    });
  });
});
