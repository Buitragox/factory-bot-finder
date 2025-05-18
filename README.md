# Factory Bot Finder

> [!WARNING]
> Work In Progress.
> The extension is in an usable state but bugs and missing features are expected.

An extension that allows you to use "Go To Definition" on FactoryBot factory methods.

## Features

This extension scans your `spec/factories/` directory to find a definition for your factories using tree-sitter.

## Extension Settings

No settings for now.

<!-- Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something. -->

## TODO list / Known Issues

- [x] Use a syntax-tree instead of *dirty* regex.

- [ ] More tests cases and complex scenarios.

- [ ] Scanning every time ensures that it finds the correct thing but it could have performance issues.
    - Maybe adding an index to save definitions that have already been found?
    - What would happen if a factory is moved? Is there a way to tell the extension to update the factories location?
    - What happens if the factory file is edited and the location inside the file changes?
    - Is it worth adding an index? Would need to do some performance testing in some way.

- [ ] Refine when the extension should be activated.

- [x] Fixed: It can confuse factories with similar names (e.g. `:user` and `:user_admin`).

- [ ] The factory scanning could be refined to look first for a file with the same name as the factory.

- [ ] Need to check what the cancellation token is used for.

- [ ] Add support for other factory methods.

- [ ] Add support for `parent:` option.

- [ ] Add support for `test/factories/` directory.

- [ ] Add GitHub actions to run the tests.

## Testing

I think there's like 3 ways to run the test suite.

```sh
npm test
npm run test
npx vscode-test
```

<!-- ## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

--- -->

<!-- ## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines) -->
