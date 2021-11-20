import {Parser} from "../src/Parser";
import {Token, TokenTypes} from "../src/Tokenizer";
import {AstNode, ExpressionNode, NodeTypes} from "../src/Node";
import {prettyLog} from "../src/utils";

describe('binary expression', () => {
  it('simple binary expression', () => {
    let parser: Parser;
    parser = new Parser();
    const ast = parser.parse(`{(1+2)+3;
    }`);

    expect(ast.toPlainObject()).toMatchObject({
      "type": "Program",
      "body": [
        {
          "type": "BlockStatement",
          "body": [
            {
              "type": "Expression",
              "operator": {
                "type": "AdditiveOperator",
                "value": "+"
              },
              "left": {
                "type": "Expression",
                "operator": {
                  "type": "AdditiveOperator",
                  "value": "+"
                },
                "left": {
                  "type": "NumericLiteral",
                  "value": 1
                },
                "right": {
                  "type": "NumericLiteral",
                  "value": 2
                }
              },
              "right": {
                "type": "NumericLiteral",
                "value": 3
              }
            },
          ]
        }
      ]
    });
  });
});
