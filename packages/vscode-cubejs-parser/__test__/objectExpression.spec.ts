import {Parser} from "../src/Parser";
import {prettyLog, toPlainObject} from "./utils";

describe('object expression', () => {
  const parser = new Parser();
  it('property declaration with assignment', () => {
    const ast = parser.parse(`
      const a = {
        a: 123,
        b: 456,
      };
    `);

    expect(toPlainObject(ast)).toMatchObject({
      "type": "Program",
      "body": [
        {
          "type": "VariableStatement",
          "value": {
            "type": "ConstKeyword",
            "value": "const"
          },
          "body": [
            {
              "type": "VariableDeclaration",
              "name": "a",
              "init": {
                "type": "ObjectDeclaration",
                "body": [
                  {
                    "type": "ObjectPropertyDeclaration",
                    "name": "a",
                    "init": {
                      "type": "NumericLiteral",
                      "value": 123
                    }
                  },
                  {
                    "type": "ObjectPropertyDeclaration",
                    "name": "b",
                    "init": {
                      "type": "NumericLiteral",
                      "value": 456
                    }
                  }
                ]
              }
            }
          ]
        }
      ]
    });

    prettyLog(ast);
  });

  it('property declaration without assignment', () => {
    const ast = parser.parse(`
      const a = {
        a,
        b: 456,
      };
    `);

    expect(toPlainObject(ast)).toMatchObject({
      "type": "Program",
      "body": [
        {
          "type": "VariableStatement",
          "value": {
            "type": "ConstKeyword",
            "value": "const"
          },
          "body": [
            {
              "type": "VariableDeclaration",
              "name": "a",
              "init": {
                "type": "ObjectDeclaration",
                "body": [
                  {
                    "type": "ObjectPropertyDeclaration",
                    "name": "a"
                  },
                  {
                    "type": "ObjectPropertyDeclaration",
                    "name": "b",
                    "init": {
                      "type": "NumericLiteral",
                      "value": 456
                    }
                  }
                ]
              }
            }
          ]
        }
      ]
    });

  });

  it('property declaration with spread assignment', () => {
    const ast = parser.parse(`
      const a = {
        a,
        ...b,
      };
    `);

    expect(toPlainObject(ast)).toMatchObject({
      "type": "Program",
      "body": [
        {
          "type": "VariableStatement",
          "value": {
            "type": "ConstKeyword",
            "value": "const"
          },
          "body": [
            {
              "type": "VariableDeclaration",
              "name": "a",
              "init": {
                "type": "ObjectDeclaration",
                "body": [
                  {
                    "type": "ObjectPropertyDeclaration",
                    "name": "a"
                  },
                  {
                    "type": "ObjectPropertyDeclaration",
                    "init": {
                      "type": "UnaryExpression",
                      "operator": {
                        "type": "...",
                        "value": "..."
                      },
                      "init": {
                        "type": "Identifier",
                        "value": "b"
                      }
                    }
                  }
                ]
              }
            }
          ]
        }
      ]
    });

  });


});
