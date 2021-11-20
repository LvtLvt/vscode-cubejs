import {Parser} from "../src/Parser";
import {prettyLog} from "../src/utils";

describe('function', () => {
  const parser = new Parser();
  it('function parameter with object destructuring', () => {
    const ast = parser.parse(`
      function abc({a: d, b, c}) {
        return a + b; 
      }
    `);

    expect(ast.toPlainObject()).toMatchObject({
      "type": "Program",
      "body": [
        {
          "type": "FunctionDeclaration",
          "body": [
            {
              "type": "ReturnStatement",
              "value": {
                "type": "Expression",
                "operator": {
                  "type": "AdditiveOperator",
                  "value": "+"
                },
                "left": {
                  "type": "Identifier",
                  "value": "a"
                },
                "right": {
                  "type": "Identifier",
                  "value": "b"
                }
              }
            },
            {
              "type": "EmptyExpression",
              "value": ""
            }
          ],
          "name": "abc",
          "params": [
            {
              "type": "ObjectDeclaration",
              "body": [
                {
                  "type": "ObjectDestructuringPropertyDeclaration",
                  "name": "a",
                  "alias": "d"
                },
                {
                  "type": "ObjectDestructuringPropertyDeclaration",
                  "name": "b"
                },
                {
                  "type": "ObjectDestructuringPropertyDeclaration",
                  "name": "c"
                }
              ]
            }
          ]
        }
      ]
    });

  });

  it('function call with parameter', () => {
    const ast = parser.parse(
      `
        a(123, a, (a+b), {a: 3}, b())
      `
    );

    expect(ast.toPlainObject()).toMatchObject({
      "type": "Program",
      "body": [
        {
          "type": "FunctionCallExpression",
          "name": "a",
          "params": [
            {
              "type": "NumericLiteral",
              "value": 123
            },
            {
              "type": "Identifier",
              "value": "a"
            },
            {
              "type": "Expression",
              "operator": {
                "type": "AdditiveOperator",
                "value": "+"
              },
              "left": {
                "type": "Identifier",
                "value": "a"
              },
              "right": {
                "type": "Identifier",
                "value": "b"
              }
            },
            {
              "type": "ObjectDeclaration",
              "body": [
                {
                  "type": "ObjectPropertyDeclaration",
                  "name": "a",
                  "init": {
                    "type": "NumericLiteral",
                    "value": 3
                  }
                }
              ]
            },
            {
              "type": "FunctionCallExpression",
              "name": "b",
              "params": []
            }
          ]
        },
      ]
    });
  });
});
