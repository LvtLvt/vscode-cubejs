import {NodeTypes, Parser} from '../src/Parser';
import {Token, TokenTypes} from "../src/Tokenizer";
import {prettyLog, toPlainObject} from "./utils";

describe('variable', () => {
  const parser = new Parser();

  it ('keyword test', () => {
    const tokenTypes = [TokenTypes.VarKeyword, TokenTypes.LetKeyword, TokenTypes.ConstKeyword];
    ['var', 'let', 'const'].forEach((keyword, i) => {
      const ast = parser.parse(`
      ${keyword} a = 3 + 3;
    `);

      expect(toPlainObject(ast)).toMatchObject(
        {
          type: NodeTypes.Program,
          body: [
            {
              type: NodeTypes.VariableStatement,
              value: new Token(tokenTypes[i], keyword),
              body: [
                {
                  type: NodeTypes.VariableDeclaration,
                  name: 'a',
                  init: {
                    type: NodeTypes.Expression,
                    operator: new Token(TokenTypes.AdditiveOperator, '+'),
                    left: {
                      type: NodeTypes.NumericLiteral,
                      value: 3,
                    },
                    right: {
                      type: NodeTypes.NumericLiteral,
                      value: 3,
                    },
                  },
                },
              ],
            }
          ],
        }
      );
    });
  });

  it('multiple variable test', () => {

    const ast = parser.parse(`
      let a, b = 3 + 3;
    `);

    prettyLog(ast);

    expect(toPlainObject(ast)).toMatchObject({
      type: NodeTypes.Program,
      body: [
        {
          type: NodeTypes.VariableStatement,
          value: new Token(TokenTypes.LetKeyword, 'let'),
          body: [
            {
              type: NodeTypes.VariableDeclaration,
              name: 'a',
            },
            {
              type: NodeTypes.VariableDeclaration,
              name: 'b',
              init: {
                type: NodeTypes.Expression,
                operator: new Token(TokenTypes.AdditiveOperator, '+'),
                left: {
                  type: NodeTypes.NumericLiteral,
                  value: 3,
                },
                right: {
                  type: NodeTypes.NumericLiteral,
                  value: 3,
                },
              },
            }
          ],
        }
      ],
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
          type: NodeTypes.VariableStatement,
          value: new Token(TokenTypes.LetKeyword, 'let'),
          body: [
            {
              type: NodeTypes.VariableDeclaration,
              name: 'a',
            },
            {
              type: NodeTypes.VariableDeclaration,
              name: 'b',
              init: {
                type: NodeTypes.Expression,
                operator: new Token(TokenTypes.AdditiveOperator, '+'),
                left: {
                  type: NodeTypes.NumericLiteral,
                  value: 3,
                },
                right: {
                  type: NodeTypes.NumericLiteral,
                  value: 3,
                },
              },
            }
          ],
        }
      ],
    });
  });


});
