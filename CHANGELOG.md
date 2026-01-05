# Changelog

## [1.21.5] - 2026-01-05

### Fixed
- **FINAL FIX**: Use Windows `start` command instead of `open`
  - The `open` command is macOS-specific and doesn't exist on Windows
  - Seanime's documentation showed `open` but it's not portable
  - Windows uses `start` command to open URLs in default browser
  - Now works on Windows! ✅
  - Plugin is Windows-only

## [1.21.4] - 2026-01-05

### Attempted Fix
- Changed validator from strict regex to `$ARGS`
- Didn't solve the underlying issue (OS-specific command problem)

## [1.21.3] - 2026-01-05

### Fixed
- Reverted to sync `$os.cmd()` API per official Seanime documentation
- Changed from async to sync command execution

## [1.21.2] - 2026-01-05

### Attempted Fix (Incorrect)
- Tried adding `open` command to `allow` list in manifest
- This approach was wrong per Seanime documentation

## [1.21.1] - 2026-01-05

### Fixed
- Removed stray escaped newline character that broke TypeScript compilation

## [1.21.0] - 2026-01-05

### Fixed
- Use proper Seanime system API `$os.cmd("open", url)`
- Added `system` scope to plugin permissions
- Added `open` command to commandScopes for URL opening

## [1.20.0] - 2026-01-05

### Fixed
- Replaced `$osExtra.asyncCmd()` with `ctx.openUrl()` 
- Both approaches were incorrect

## [1.19.1] - 2026-01-05

### Fixed
- Resolved TypeScript compilation error with mismatched quotes

## [1.19.0] - 2026-01-05

### Fixed
- Moved `$osExtra.asyncCmd()` execution to main plugin scope
- Better error handling with detailed logging

---

## [1.18.0] - Previous Release

For previous versions, see git history.
