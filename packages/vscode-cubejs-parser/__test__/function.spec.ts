import {Parser} from "../src/Parser";
import {prettyLog} from "./utils";

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
              "type": "BlockStatement",
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
              ]
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
        a(123, a, (a+b), {a: 3}, b());
      `
    );

    prettyLog(ast.toPlainObject());
  });
});
