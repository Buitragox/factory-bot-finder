import * as vscode from 'vscode';
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

	const defDisp = vscode.languages.registerDefinitionProvider({ language: 'ruby', scheme: 'file' }, {
		async provideDefinition(document, position, token) {
			// Check for build or create followed by a symbol
			// e.g. `build(:user)` or `create :user`
			const wordRange = document.getWordRangeAtPosition(position, /\b(build|create)\b[\s|(]:[\w]+/);
			if (!wordRange) {
				return;
			}

			// Check if the word is build or create
			const word = document.getText(wordRange);
			const method_name = word.match(/build|create/)![0];
			// Create a new start point for the range, so we only get the symbol
			const start = new vscode.Position(wordRange.start.line, wordRange.start.character + method_name.length + 1);
			// If cursor is not on the symbol, do nothing. We don't want to match the method name
			if (position.character < start.character) {
				return;
			}

			const factory_name = word.slice(method_name.length + 2);
			const newWordRange = new vscode.Range(start, wordRange.end);
			console.log("position:", position.character);
			console.log("newWordRange:", newWordRange.start.character, newWordRange.end.character);

			const files = await vscode.workspace.findFiles('spec/factories/**/*.rb');
			console.log("files:", files);
			for (const file of files) {
				const doc = await vscode.workspace.openTextDocument(file);
				const text = doc.getText();

				const start = text.indexOf(`factory :${factory_name}`);
				if (start === -1) {
					continue;
				}

				const skip = 'factory :'.length;
				const position = doc.positionAt(start + skip);
				const wordRange = doc.getWordRangeAtPosition(position)!;
				console.log("FOUND!");
				return new vscode.Location(doc.uri, wordRange);
			}
			console.log("NOT FOUND!");
		}
	});

	// TODO: add better workspace detection before susbcribing
	// vscode.workspace.workspaceFolders seems like a good starting point
	context.subscriptions.push(defDisp);
}

// This method is called when your extension is deactivated
export function deactivate() { }
