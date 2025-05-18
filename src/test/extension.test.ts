import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

interface UriMap {
	[key: string]: vscode.Uri;
}

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');
	let workspaceUri: vscode.Uri;
	let specs: UriMap = {}; // Map of spec names to their URIs
	let factories: UriMap = {}; // Map of factory names to their URIs

	suiteSetup(async () => {
		// HACK: Without this, the extension is not activated and the factory definition provider is not registered.
		await vscode.extensions.getExtension('undefined_publisher.factory-bot-finder')!.activate();

		const folders = vscode.workspace.workspaceFolders;
		if (!folders) {
			throw new Error('No workspace folders found');
		}

		workspaceUri = folders[0].uri;

		const specUris = await vscode.workspace.findFiles('spec/**/*spec.rb');
		if (specUris.length === 0) {
			throw new Error('No spec.rb files found in the workspace');
		}

		specUris.forEach((specUri) => {
			const specName = path.basename(specUri.fsPath, '_spec.rb');
			specs[specName] = specUri;
		});

		const factoriesUris = await vscode.workspace.findFiles('spec/factories/**/*.rb');
		if (factoriesUris.length === 0) {
			throw new Error('No factory.rb files found in the workspace');
		}

		factoriesUris.forEach((factoryUri) => {
			const factoryName = path.basename(factoryUri.fsPath, '.rb');
			factories[factoryName] = factoryUri;
		});
	});

	suiteTeardown(() => {
	});

	// The important thing is to check that we can find the factory definition
	// for a given factory name.
	// So given a mouse position, the definitionProvider should return the location
	// of the factory definition in the spec/factories directory.
	test('finds factory definition for build', async () => {
		// Give the mouse position to the factory definition provider
		// How should I get the mouse position? Scan the spec files?
		// Look for build(:factory) in the spec files
		// Should I have a list of factory names to test against?

		const specUri = specs['user'];
		const specDoc = await vscode.workspace.openTextDocument(specUri);

		// Find the position of the factory name in the spec
		const factoryNamePos = new vscode.Position(1, 27); // Line with "build(:user)" at position of "user"

		const definitions = (await vscode.commands.executeCommand('vscode.executeDefinitionProvider', specDoc.uri, factoryNamePos)) as vscode.Location[];
		// Factory file in the filesystem
		const testFactoryUri = factories['user'];

		// Check if the definition points to our factory file
		const definition = definitions[0];
		assert.strictEqual(definition.uri.fsPath, testFactoryUri.fsPath);
		assert.deepStrictEqual(definition.range, new vscode.Range(1, 11, 1, 15));
	});

	// test('finds factory definition for create', () => {
	// });

	test('does not find factory definition for non-existent factory', async () => {
		const specUri = specs['user'];
		const specDoc = await vscode.workspace.openTextDocument(specUri);

		// Find the position of the factory name in the spec
		const factoryNamePos = new vscode.Position(6, 27); // Line with "build(:user)" at position of "user"

		const definitions = (await vscode.commands.executeCommand('vscode.executeDefinitionProvider', specDoc.uri, factoryNamePos)) as vscode.Location[];
		assert.strictEqual(definitions.length, 0);
	});

	test('handles alternative syntax `create :user`', async () => {
		const specUri = specs['user'];
		const specDoc = await vscode.workspace.openTextDocument(specUri);

		// Find the position of the factory name in the spec
		const factoryNamePos = new vscode.Position(3, 24); // Line with "create :user" at position of "user"

		const definitions = (await vscode.commands.executeCommand('vscode.executeDefinitionProvider', specDoc.uri, factoryNamePos)) as vscode.Location[];
		// Factory file in the filesystem
		const testFactoryUri = factories['user'];

		// Check if the definition points to our factory file
		const definition = definitions[0];
		assert.strictEqual(definition.uri.fsPath, testFactoryUri.fsPath);
		assert.ok(definition.range);
		assert.deepStrictEqual(definition.range, new vscode.Range(1, 11, 1, 15));
	});
});
