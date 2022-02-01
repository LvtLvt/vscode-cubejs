import * as vscode from "vscode";

export function getCubeConfig(uri?: vscode.Uri) {
  return getConfig('cube', uri);
}

function getConfig(section: string, uri?: vscode.Uri) {
  if (!uri) {
    if (vscode.window.activeTextEditor) {
      uri = vscode.window.activeTextEditor.document.uri;
    }
  }

  return vscode.workspace.getConfiguration(section, uri);
}
