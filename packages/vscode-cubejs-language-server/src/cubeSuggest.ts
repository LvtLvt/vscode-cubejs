import * as vscode from 'vscode';
import {
  CancellationToken,
  CompletionContext,
  CompletionItem,
  CompletionItemKind,
  CompletionList,
  Position,
  ProviderResult,
  TextDocument
} from 'vscode';

const cubeProps: string[] = [
  'measures',
  'dimensions',
];

export class CubeCompletionItemProvider implements vscode.CompletionItemProvider, vscode.Disposable {
  constructor(private readonly ctx: vscode.ExtensionContext) { }

  dispose(): any { }

  provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): Thenable<CompletionList> {
    return this.provideCompletionItemsInternal(document, position, token, context).then((result) => {

      if (!result) {
        return new vscode.CompletionList([], false);
      }

      if (Array.isArray(result)) {
        return new vscode.CompletionList(result, false);
      }

      return result;
    });
  }

  resolveCompletionItem(item: CompletionItem, token: CancellationToken): ProviderResult<CompletionItem> {
    return undefined;
  }

  private async provideCompletionItemsInternal(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): Promise<vscode.CompletionItem[] | vscode.CompletionList> {

    // TODO: get import statement completions

    // TODO: comment position

    // TODO: string position

    // top scope lookup for cube function

    // return [];
    return [];
  }

  private getCurrentWord(document: vscode.TextDocument, position: vscode.Position): string {
    const wordAtPosition = document.getWordRangeAtPosition(position);
    let currentWord = '';
    if (wordAtPosition && wordAtPosition.start.character < position.character) {
      const word = document.getText(wordAtPosition);
      currentWord = word.substr(0, position.character - wordAtPosition.start.character);
    }

    return currentWord;
  }

  private getCubePropsCompletions(currentWord: string): vscode.CompletionItem[] {

    if (!currentWord.length) {
      return [];
    }

    const completionItems: vscode.CompletionItem[] = [];

    for (const prop of cubeProps) {
      if (prop.startsWith(currentWord)) {
        completionItems.push(new vscode.CompletionItem(prop, CompletionItemKind.Property));
      }
    }

    return completionItems;
  }

}
