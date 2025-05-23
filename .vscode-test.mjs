import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	workspaceFolder: './src/test/test-project',
	mocha: {
		timeout: 20000
	}
});
