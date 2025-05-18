import {
    DefinitionProvider,
    Position,
    workspace,
    Location,
    TextDocument,
    CancellationToken,
    Definition,
} from "vscode";

async function findLocations(factoryName: string): Promise<Location | undefined> {
    const files = await workspace.findFiles("spec/factories/**/*.rb");
    console.log("files:", files);
    for (const file of files) {
        const doc = await workspace.openTextDocument(file);
        const text = doc.getText();

        const start = text.indexOf(`factory :${factoryName} `);
        if (start === -1) {
            continue;
        }

        const skip = "factory :".length;
        const position = doc.positionAt(start + skip);
        const wordRange = doc.getWordRangeAtPosition(position)!;
        console.log("FOUND!");
        return new Location(doc.uri, wordRange);
    }
    console.log("NOT FOUND!");
    return;
}

export const factoryDefinitionProvider: DefinitionProvider = {
    async provideDefinition(
        document: TextDocument,
        position: Position,
        token: CancellationToken
    ): Promise<Definition | undefined> {
        console.log("Factory definition provider activated");
        // Check for build or create followed by a symbol
        // e.g. `build(:user)` or `create :user`
        const wordRange = document.getWordRangeAtPosition(
            position,
            /\b(build|create)\b[\s|(]:[\w]+/
        );
        if (!wordRange) {
            return;
        }

        // Check if the word is build or create
        const word = document.getText(wordRange);
        const method_name = word.match(/build|create/)![0];
        // Create a new start point for the range, so we only get the symbol
        const start = new Position(
            wordRange.start.line,
            wordRange.start.character + method_name.length + 1
        );
        // If cursor is not on the symbol, do nothing. We don't want to match the method name
        if (position.character < start.character) {
            return;
        }

        console.log('Looking for locations');

        const factoryName = word.slice(method_name.length + 2);
        return findLocations(factoryName);
    }
};
