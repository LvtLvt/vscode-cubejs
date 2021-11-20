import {Parser} from '../../src/Parser';
import {Token, TokenTypes} from "../../src/Tokenizer";
import {prettyLog, toPlainObject} from "../../src/utils";
import {AstNode, NodeTypes} from "../../src/Node";

describe('variable', () => {
  const parser = new Parser();

  it ('keyword test', () => {
    const tokenTypes = [TokenTypes.VarKeyword, TokenTypes.LetKeyword, TokenTypes.ConstKeyword];
    ['var', 'let', 'const'].forEach((keyword, i) => {
      const ast = parser.parse(`
      ${keyword} a = 3 + 3;
    `);

      expect(ast.toPlainObject()).toMatchObject({
        "type": "Program",
        "body": [
          {
            "type": "VariableStatement",
            "value": new Token(tokenTypes[i], keyword),
            "body": [
              {
                "type": "VariableDeclaration",
                "name": "a",
                "init": {
                  "type": "Expression",
                  "operator": {
                    "type": "AdditiveOperator",
                    "value": "+"
                  },
                  "left": {
                    "type": "NumericLiteral",
                    "value": 3
                  },
                  "right": {
                    "type": "NumericLiteral",
                    "value": 3
                  }
                }
              }
            ]
          },
        ]
      })

    });
  });

  it('multiple variable test', () => {

    const ast = parser.parse(`
      let a, b = 3 + 3;
    `);

    expect(ast.toPlainObject()).toMatchObject({
      "type": "Program",
      "body": [
        {
          "type": "VariableStatement",
          "value": {
            "type": "LetKeyword",
            "value": "let"
          },
          "body": [
            {
              "type": "VariableDeclaration",
              "name": "a"
            },
            {
              "type": "VariableDeclaration",
              "name": "b",
              "init": {
                "type": "Expression",
                "operator": {
                  "type": "AdditiveOperator",
                  "value": "+"
                },
                "left": {
                  "type": "NumericLiteral",
                  "value": 3
                },
                "right": {
                  "type": "NumericLiteral",
                  "value": 3
                }
              }
            }
          ]
        }
      ]
    });

  });

  it('channing variable test', () => {

    const ast = parser.parse(`
      let a = b = 3 + 3;
    `);

    prettyLog(ast);

    expect(toPlainObject(ast)).toMatchObject({
      type: NodeTypes.Program,
      body: [
        {
          "type": "VariableStatement",
          "value": {
            "type": "LetKeyword",
            "value": "let"
          },
          "body": [
            {
              "type": "VariableDeclaration",
              "name": "a",
              "init": {
                "type": "Expression",
                "operator": {
                  "type": "SimpleAssignmentOperator",
                  "value": "="
                },
                "left": {
                  "type": "Identifier",
                  "value": "b"
                },
                "right": {
                  "type": "Expression",
                  "operator": {
                    "type": "AdditiveOperator",
                    "value": "+"
                  },
                  "left": {
                    "type": "NumericLiteral",
                    "value": 3
                  },
                  "right": {
                    "type": "NumericLiteral",
                    "value": 3
                  }
                }
              }
            }
          ]
        },
      ],
    });
  });


});
