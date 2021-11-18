import {Parser} from "../src/Parser";
import {prettyLog} from "./utils";

describe('manual', () => {
  const parser = new Parser();
  it('for manual test', () => {
    const ast = parser.parse(`
      const a = {
        a: 123,
        b: 456,
      };
    `);

    prettyLog(ast);
  });
});
