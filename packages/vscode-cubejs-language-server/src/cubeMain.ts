import * as vscode from "vscode";
import {CommandInvocation, ExtensionAPI} from "./export";
import {Uri} from "vscode";
import State from "./state";
import {getCubeConfig} from "./config";

export async function activate(ctx: vscode.ExtensionContext): Promise<ExtensionAPI> {

  State.globalState = ctx.globalState;
  State.workSpaceState = ctx.workspaceState;

  const cfg = getCubeConfig();
  // if (vscode.window.registerWebviewPanelSerializer) {
  //   vscode.window.registerWebviewPanelSerializer()
  // }

  return {
    settings: {
      getExecutionCommand(toolName: string, resource?: Uri): CommandInvocation | undefined {
        return;
      }
    }
  }
}
