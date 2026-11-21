# Contributing

Thanks for helping improve SFCC DW Profile Config.

## Setup

Requires Node.js 20+ and VS Code.

```sh
npm ci
npm run compile   # type-check and compile to out/
npm test          # compile and run the unit tests (node:test, mocked VS Code API)
```

## Debugging

Open the folder in VS Code and press `F5` (the "Run Extension" configuration in `.vscode/launch.json` compiles first) to launch an Extension Development Host with the extension loaded. Use `npm run watch` to recompile on save.

## Packaging

```sh
npx @vscode/vsce package
```

This runs `vscode:prepublish` (clean + esbuild bundle) and produces a `.vsix` you can install with `code --install-extension <file>.vsix`.

## Pull requests

- Keep each PR focused on one change and describe what it does and why.
- `npm test` and `npx @vscode/vsce package` must pass (CI runs both).
- Add or update tests in `src/*.test.ts` when you change behaviour.
- Add an entry under a new or `Unreleased` heading in `CHANGELOG.md` for user-visible changes.
- Never commit real credentials or a real `dw.json`.
