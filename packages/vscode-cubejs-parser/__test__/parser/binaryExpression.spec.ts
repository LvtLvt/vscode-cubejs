import {Parser} from "../../src/Parser";

describe('binary expression', () => {
  it('simple binary expression', () => {
    let parser = new Parser();
    const ast = parser.parse(`{(1+2)+3
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
