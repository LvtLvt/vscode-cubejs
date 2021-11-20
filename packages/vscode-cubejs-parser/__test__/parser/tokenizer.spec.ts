import {Tokenizer} from "../../src/Tokenizer";

describe('tokenizer', () => {
  it('should return token', () => {
    const tokenizer = new Tokenizer();
    tokenizer.init('123');
    const nextToken = tokenizer.getNextToken();
    expect(nextToken).not.toBeNull();
  });
});
