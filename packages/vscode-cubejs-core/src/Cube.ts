import {TrieNode} from "./Trie";

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
  private _measures: TrieNode<Measure> = new TrieNode<Measure>(TrieNode.EMPTY_KEY);

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

