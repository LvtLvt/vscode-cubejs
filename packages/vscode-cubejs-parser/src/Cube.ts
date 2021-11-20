interface ICursor {
  start: number;
  end: number;
}

interface ICompletion {
  describeCompletionInfo: () => any;
}

class CubeFile {
  readonly filePath: string;

  constructor(props: {filePath: string}) {
    this.filePath = props.filePath;
  }
  // TODO: vscode api
}

class Measure implements ICursor, ICompletion {
  start: number;
  end: number;

  constructor(props: {
    start: number;
    end: number;
  }) {
    this.start = props.start;
    this.end = props.end;
  }

  describeCompletionInfo() {
    // TODO: detail info
    return {};
  }
}

interface IMeasure {
  name: string;
  type: string;
  sql: string;

}

export class Cube {
  cubeFile: CubeFile;
  private _measures: TrieNode<Measure> = new TrieNode<Measure>();

  constructor(props: {cubeFile: CubeFile}) {
    this.cubeFile = props.cubeFile;
  }

  get measures(): TrieNode<Measure> {
    return this._measures;
  }
}

// enum SearchMethod {
//   Default =
// }

class Trie {

  private _root = new TrieNode();

  insert(key: string, value: T) {

  }

  delete() {

  }
  search(keyword: string): T {

  }
}

class TrieNode<T> {
  children: Record<string, TrieNode<T>> = {};
  values: T[] = [];

  constructor() {}

  insert(key: string, value: T, depth: number = 0): void {
    if (key.length === depth + 1) {
      return
    }

    const character = key[depth];
    const child = this.children[character] || new TrieNode();

    child.values.push(value);
    child.insert(key, value, depth + 1);

    this.children[character] = child;
  }

  search(key: string): T[] {
    const values: T[] = [];
    

    return;
  }
}
