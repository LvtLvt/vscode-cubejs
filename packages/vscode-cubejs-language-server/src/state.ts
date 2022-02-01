import {Memento} from "vscode";

let globalState: Memento;
let workspaceState: Memento;

class State {
  public globalState: Memento | null = null;
  public workSpaceState: Memento | null = null;
}

export default new State();
