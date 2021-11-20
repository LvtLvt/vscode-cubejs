import {Parser} from "../src/Parser";
import {prettyLog} from "../src/utils";

describe('manual', () => {
  const parser = new Parser();
  it('for manual test', () => {
    const ast = parser.parse(`
      function abc({a: d, b, c}) {
        return a + b;
      }
    `);

    prettyLog(ast);
  });
});
