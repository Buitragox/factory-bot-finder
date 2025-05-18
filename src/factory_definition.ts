import {
    DefinitionProvider,
    Position,
    workspace,
    Location,
    TextDocument,
    CancellationToken,
    Definition,
} from "vscode";
import Parser from "tree-sitter";
import Ruby from "tree-sitter-ruby";

const FACTORY_METHODS = [
    "build",
    "create",
    "build_list",
    "create_list"
];
const FACTORY_METHOD_REGEX = `\\b(${FACTORY_METHODS.join("|")})\\b`;

async function findLocations(factoryName: string): Promise<Location | undefined> {
    const files = await workspace.findFiles("spec/factories/**/*.rb");
    const parser = new Parser();
    parser.setLanguage(Ruby);

    for (const file of files) {
        const doc = await workspace.openTextDocument(file);
        const text = doc.getText();

        const tree = parser.parse(text);
        const symbols = tree.rootNode.descendantsOfType('simple_symbol');
        for (const symbol of symbols) {
            const name = symbol.text.slice(1);
            if (name === factoryName) {
                const position = doc.positionAt(symbol.startIndex + 1);
                const wordRange = doc.getWordRangeAtPosition(position)!;
                console.log(`Found :${factoryName} in ${file.fsPath} at ${position.line}:${position.character}`);
                return new Location(doc.uri, wordRange);
            }
        }
    }
    console.log(`No match for ${factoryName}`);
    return;
}

export const factoryDefinitionProvider: DefinitionProvider = {
    async provideDefinition(
        document: TextDocument,
        position: Position,
        token: CancellationToken
    ): Promise<Definition | undefined> {
        // Check for a factory method name followed by a symbol
        const wordRange = document.getWordRangeAtPosition(
            position,
            new RegExp(`${FACTORY_METHOD_REGEX}[\\s|\\(]:[\\w]+`)
        );
        if (!wordRange) {
            return;
        }

        // Check which factory method is used
        const word = document.getText(wordRange);
        const methodName = word.match(new RegExp(FACTORY_METHOD_REGEX))![0];

        // Create a new start point for the range, so we only get the symbol
        const start = new Position(
            wordRange.start.line,
            wordRange.start.character + methodName.length + 1
        );
        // If cursor is not on the symbol, do nothing. We don't want to match the method name
        if (position.character < start.character) {
            return;
        }

        const factoryName = word.slice(methodName.length + 2);
        return findLocations(factoryName);
    }
};
