# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.1.4 - 2026-11-21

### Changed
- Licensed under MIT (previously proprietary).
- `dwProfiles.profiles` is now application-scoped: profiles can only be defined in user settings, not in a workspace's `.vscode/settings.json`.
- README: states plainly that profiles (including passwords) are stored in plain text in your user `settings.json` and may be synced by Settings Sync; corrects the hostname-to-icon list; adds install instructions and badges; notes that only the first folder of a multi-root workspace is used.
- Added repository metadata (bugs, homepage, sponsor, keywords) to `package.json`.

### Security
- Profile editor webview now HTML-escapes every profile value and runs under a Content Security Policy with a per-load nonce for its script.

### Removed
- The "DW Profiles: Run Internal Tests" command (development-only).
- The `prepare` script that silently set `core.hooksPath`, along with `.githooks/` and its setup script.
- Unused `src/standaloneTest.ts` and the activation `console.log`.

### Packaging
- `.vscodeignore` now ships only the bundled `out/extension.js`, the Marketplace icon, the activity bar icon, README, CHANGELOG and LICENSE.
- `vscode:prepublish` cleans `out/` before bundling.
- Added CI (tests + `vsce package`), Dependabot, CONTRIBUTING, SECURITY and a bug report template.

## 1.1.3 - 2026-04-01

### Added
- Unit test suite (`npm test`) with a mocked VS Code API.

## 1.1.2 - 2026-03-26

### Fixed
- Extension icon on light backgrounds.

## 1.1.1 - 2026-03-26

### Added
- Unified webview profile editor, environment-specific sidebar icons, and `cartridge` / `cartridgePath` support in `dw.json`.

## 1.0.1 - 2026-03-25

### Added
- Extension icons.

## 1.0.0 - 2026-03-25

- Initial release.

