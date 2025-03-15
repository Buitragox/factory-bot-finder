import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

suite('Extension Test Suite', async () => {
	vscode.window.showInformationMessage('Start all tests.');
	let workspaceUri: vscode.Uri;
	let specUris: vscode.Uri[];
	let factoriesUris: vscode.Uri[];

	suiteSetup(async () => {
		const folders = vscode.workspace.workspaceFolders;
		if (!folders) {
			throw new Error('No workspace folders found');
		}

		workspaceUri = folders[0].uri;

		specUris = await vscode.workspace.findFiles('spec/**/*spec.rb');
		if (specUris.length === 0) {
			throw new Error('No spec.rb files found in the workspace');
		}

		factoriesUris = await vscode.workspace.findFiles('spec/factories/**/*.rb');
		if (factoriesUris.length === 0) {
			throw new Error('No factory.rb files found in the workspace');
		}
	});

	// Clean up after tests
	suiteTeardown(() => {
	});

	// test('Extension is activated', async () => {
	// 	// Wait for the extension to activate
	// 	await new Promise(f => setTimeout(f, 5000));
	// 	assert.equal(true, true);
	// });

	describe('Factory Bot Finder', () => {
		// The important thing is to check that we can find the factory definition
		// for a given factory name.
		// So given a mouse position, the definitionProvider should return the location
		// of the factory definition in the spec/factories directory.
		test('finds factory definition for build', () => {
			// Give the mouse position to the factory definition provider
			// How should I get the mouse position? Scan thorough the spec files?
			// Look for build(:factory) in the spec files
			// Should I have a list of factory names to test against?
		});

		// test('finds factory definition for create', () => {
		// });

		// test('does not find factory definition for non-existent factory', () => {
		// });

		// test('Should handle alternative syntax: create :user'

		//test('Should not find definition when cursor is on method name',
	});
});
