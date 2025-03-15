# Factory Bot Finder

> [!WARNING]
> Work In Progress

An extension that allows you to use "Go To Definition" on FactoryBots factory methods.

## Features

This extension scans your `spec/factories/` directory to find a definition for your factories.

## Extension Settings

No settings for now. Not sure if settings are even necessary.

<!-- Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: Enable/disable this extension.
* `myExtension.thing`: Set to `blah` to do something. -->

## TODO list / Known Issues

- More tests, more test cases and complex scenarios. Similar factory names.

- It scans for factories every time you try to find definitions.
Maybe adding an index to save definitions that have already been found?
    - What would happen if a factory is moved? Is there a way to tell the extension to update the factories location?
    - What happens if the factory file is edited and the location inside the file changes?
    - Scanning every time ensures that it finds the correct thing but it could have performance issues.
    - Is it worth adding an index? Would need to do some performance testing in some way.

- Refine when the extension should be activated.

- It can confuse factories with similar names (e.g. `:user` and `:user_admin`).

- The factory scanning could be refined to look first for a file with the same name as the factory.

- Need to check what the cancellation token is used for.

- Add support for other factory methods and the `parent:` option.

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
