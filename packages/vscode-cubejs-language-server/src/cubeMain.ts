import * as vscode from "vscode";
import {CommandInvocation, ExtensionAPI} from "./export";
import {Uri} from "vscode";
import State from "./state";
import {getCubeConfig} from "./config";
import {startLanguageServer} from "./cubeLanguageServer";

export async function activate(ctx: vscode.ExtensionContext): Promise<ExtensionAPI> {

  State.globalState = ctx.globalState;
  State.workSpaceState = ctx.workspaceState;

  const cfg = getCubeConfig();

  // if need a welcome message later, use this
  // if (vscode.window.registerWebviewPanelSerializer) {
  //   vscode.window.registerWebviewPanelSerializer()
  // }

  await startLanguageServer(ctx, 'activation');

  return {
    settings: {
      getExecutionCommand(toolName: string, resource?: Uri): CommandInvocation | undefined {
        return;
      }
    }
  }
}
