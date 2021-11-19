import {Parser} from "../src/Parser";
import {prettyLog} from "./utils";

describe('manual', () => {
  const parser = new Parser();
  it('for manual test', () => {
    const ast = parser.parse(`
      function abc() {
        return a + b;
      }
    `);

    prettyLog(ast);
  });
});
