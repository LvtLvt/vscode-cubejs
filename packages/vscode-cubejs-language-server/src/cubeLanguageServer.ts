import * as vscode from 'vscode';
import {LanguageClient} from 'vscode-languageclient/node';
import {Mutex} from "./utils/mutex";

const languageServerMutex = new Mutex();
let languageServerClient: LanguageClient | null = null;

export type RestartReason = 'activation' | 'manual' | 'config change' | 'installation';

export async function startLanguageServer(ctx: vscode.ExtensionContext, reason: RestartReason) {

  const unlock = await languageServerMutex.lock();
  languageServerClient = await buildLanguageClient(ctx);
  try {
  } finally {
    unlock();
  }
}

export async function buildLanguageClient(ctx: vscode.ExtensionContext): Promise<LanguageClient> {
  return new LanguageClient(
    'cube', // id
    'cube',
    {

    },
    {

    },
    {

    }
  );
}
