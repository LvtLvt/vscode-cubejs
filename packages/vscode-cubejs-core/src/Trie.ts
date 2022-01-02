export class Trie<T> {
  private _root = new TrieNode<T>(TrieNode.EMPTY_KEY);

  insert(key: string, value: T) {
    this._root.insert(key, value);
  }

  search(keyword: string): T[] {
    return this._root.search(keyword);
  }
}

export class TrieNode<T> {

  public static readonly EMPTY_KEY = "";

  private children: Map<string, TrieNode<T>> = new Map<string, TrieNode<T>>();
  private values: T[] = [];

  constructor(key: string);
  constructor(key: string, value: T);
  constructor(readonly key: string, value?: T)  {
    if (value) {
      this.values.push(value);
    }
  }

  insert(key: string, value: T): void {

    if (this.children.size === 0) {
      this.children.set(key, new TrieNode<T>(key, value));
      return;
    }

    for (const [existingKey, childNode] of Object.entries(Object.fromEntries(this.children))) {

      if (existingKey === key) {
        childNode.values.push(value);
        return;
      }

      let commonLength = childNode._calculateCommonLength(key);

      if (commonLength !== 0) {
        switch (commonLength) {
          case key.length: {
            /**
             * existingKey: test
             * newKey: te
             */
            this.children.delete(existingKey);

            const newNode = new TrieNode(key, value);
            newNode.children.set(existingKey, childNode);

            this.children.set(key, new TrieNode<T>(key, value));
            break;
          }
          case existingKey.length: {
            /**
             * existingKey: te
             * newKey: test
             */
            childNode.insert(key.substring(commonLength), value);
            break;
          }

          default: {
            /**
             * existingKey: test
             * newKey: ted
             */

            this.children.delete(existingKey);
            const newKeyPrefix = key.substring(0, commonLength);
            const newKeySuffix = key.substring(commonLength);

            const newNode = new TrieNode<T>(newKeyPrefix);
            newNode.children.set(existingKey.substring(commonLength), childNode); // old
            newNode.children.set(newKeySuffix, new TrieNode<T>(newKeySuffix, value)); // new

            this.children.set(newKeyPrefix, newNode);
          }
        }
      } else {
        // this term should be common prefix node
        this.children.set(key, new TrieNode(key, value));
      }
    }
  }

  search(searchKeyword: string, isRecursiveSearch?: boolean): T[] {

    const results: T[] = [...this.values];

    // TODO: find child with searchKeyword as prefix
    for (const [childKey, childNode] of this.children) {

      if (isRecursiveSearch) {
        results.push(...childNode.search("", true));
        continue;
      }

      if (searchKeyword.startsWith(childKey)) {
        results.push(...childNode.search(searchKeyword.substring(childKey.length)));
      } else if (childKey.startsWith(searchKeyword)) {
        results.push(...childNode.search("", true));
      }
    }

    return results;
  }

  private _calculateCommonLength(newKey: string) {
    let commonLength = 0;
    const numOfMaxCommonLength = Math.min(newKey.length, this.key.length);

    for (let i=0; i < numOfMaxCommonLength; i++) {
      if (this.key[i] !== newKey[i]) {
        break;
      }

      commonLength = i + 1;
    }

    return commonLength;
  }
}
