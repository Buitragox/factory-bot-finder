import * as vscode from 'vscode';
import { factoryDefinitionProvider } from './factory_definition';
//import { ExtensionContext, window, languages, commands } from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	console.log('"factory-bot-finder" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('factory-bot-finder.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello and Goodbye from Factory Bot Finder!');
	});
	context.subscriptions.push(disposable);

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
