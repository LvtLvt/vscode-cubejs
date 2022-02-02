import * as vscode from 'vscode';
import {
  CancellationToken,
  CompletionContext,
  CompletionItem, CompletionList,
  Position,
  ProviderResult,
  TextDocument
} from "vscode";

export class CubeCompletionItemProvider implements vscode.CompletionItemProvider, vscode.Disposable {
  constructor(private readonly ctx: vscode.ExtensionContext) { }

  dispose(): any {
  }

  provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): ProviderResult<CompletionItem[] | CompletionList> {
    return undefined;
  }

  resolveCompletionItem(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
    return undefined;
  }

}
