import * as vscode from 'vscode';
import { factoryDefinitionProvider } from './factory_definition';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	console.log('"factory-bot-finder" is now active!');

	const hoverDisposable = vscode.languages.registerHoverProvider({ language: 'ruby', scheme: 'file' }, {
		provideHover(document, position, token) {
			console.log("Hover activated");
			const wordRange = document.getWordRangeAtPosition(position, /:[\w]+/);
			if (wordRange) {
				const word = document.getText(wordRange);
				return new vscode.Hover(`FactoryBot ${word}`, wordRange);
			}
		}
	});
	context.subscriptions.push(hoverDisposable);

	const defDisp = vscode.languages.registerDefinitionProvider({ language: 'ruby', scheme: 'file' }, factoryDefinitionProvider);

	// TODO: add better workspace detection before susbcribing
	// vscode.workspace.workspaceFolders seems like a good starting point
	context.subscriptions.push(defDisp);
}

// This method is called when your extension is deactivated
export function deactivate() { }
