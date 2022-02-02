import * as vscode from 'vscode';
import {CloseAction, ErrorAction, LanguageClient} from 'vscode-languageclient/node';
import {Mutex} from "./utils/mutex";
import {Message} from "vscode-languageserver-protocol";
import {CubeCompletionItemProvider} from "./cubeSuggest";

const languageServerMutex = new Mutex();
let languageServerClient: LanguageClient | null = null;
let languageProviders: vscode.Disposable[] = [];

let crashCount = 0;

export type RestartReason = 'activation' | 'manual' | 'config change' | 'installation';

export async function startLanguageServer(ctx: vscode.ExtensionContext, reason: RestartReason) {

  const unlock = await languageServerMutex.lock();
  try {
    languageServerClient = await buildLanguageClient(ctx);
    registerLanguageProviders(ctx);
  } finally {
    unlock();
  }

}

export async function buildLanguageClient(ctx: vscode.ExtensionContext): Promise<LanguageClient> {
  return new LanguageClient(
    'cube', // id
    'cube',
    {
      command: '',
      args: [],
      options: { env: {} },
    },
    {
      documentSelector: [
        { language: 'js', scheme: 'file' },
      ],
      errorHandler: {
        error(error: Error, message: Message, count: number): ErrorAction {
          if (count < 5) {
            return ErrorAction.Continue;
          }

          vscode.window.showErrorMessage(`Error communicating with the language server: ${error}: ${message}`);

          return ErrorAction.Shutdown;
        },
        closed(): CloseAction {
          if (++crashCount < 5) {
            return CloseAction.Restart;
          }
          return CloseAction.DoNotRestart;
        }
      },
    },
  );
}

function registerLanguageProviders(ctx: vscode.ExtensionContext) {
  vscode.languages.registerCompletionItemProvider({language: 'js', scheme: 'file'}, new CubeCompletionItemProvider(ctx), '.', '"');
}
