import { Uri } from 'vscode';

export interface CommandInvocation {
  binPath: string;
  args?: string[];
  env?: Object;
  cwd?: string;
}

export interface ExtensionAPI {
  settings: {
    getExecutionCommand(toolName: string, resource?: Uri): CommandInvocation | undefined;
  };
}
