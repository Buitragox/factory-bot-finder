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
    "create_list",
    "build_stubbed",
];

const parser = new Parser();
parser.setLanguage(Ruby);

async function findLocations(factoryName: string): Promise<Location | undefined> {
    const files = await workspace.findFiles("spec/factories/**/*.rb");
    for (const file of files) {
        const doc = await workspace.openTextDocument(file);
        const text = doc.getText();

        const tree = parser.parse(text);
        const symbols = tree.rootNode.descendantsOfType('simple_symbol');
        for (const symbol of symbols) {
            const name = symbol.text;
            if (name === factoryName) {
                const position = doc.positionAt(symbol.startIndex + 1);
                const wordRange = doc.getWordRangeAtPosition(position)!;
                console.log(`Found ${factoryName} in ${file.fsPath} at ${position.line}:${position.character}`);
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
        const tree = parser.parse(document.getText());
        const syntaxNode = tree.rootNode.descendantForPosition({ row: position.line, column: position.character });
        if (syntaxNode.type !== "simple_symbol") {
            return;
        }

        const methodName = syntaxNode.parent?.previousSibling?.text;
        if (!methodName || !FACTORY_METHODS.includes(methodName)) {
            return;
        }

        const factoryName = syntaxNode.text;
        return findLocations(factoryName);
    }
};
