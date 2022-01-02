import {Trie} from "../../src/Cube";

describe('Cube autocomplete', () => {
  it('should return value which is inserted correctly', function () {
    const trie = new Trie<String>();

    const toBeStoredKey = ['my key', 'my name', 'm name'];
    const toBeStoredValue = ['my value', 'my value2', 'my value3'];

    toBeStoredKey.forEach((v, i) => {
      trie.insert(toBeStoredKey[i], toBeStoredValue[i]);
    });

    expect(trie.search("m")).toEqual(toBeStoredValue);

    expect(trie.search("my")).toEqual(toBeStoredValue.slice(0, 2));
    expect(trie.search("my n")).toEqual([toBeStoredValue[1]]);
    expect(trie.search("my name")).toEqual([toBeStoredValue[1]]);

    expect(trie.search("m")).not.toEqual(toBeStoredValue.concat("abc"));
    expect(trie.search("my b").length).toBe(0);
  });
});
