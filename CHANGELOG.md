# Changelog

## [1.21.1] - 2026-01-05

### Fixed
- **Hotfix**: Removed stray escaped newline character (`\n`) that broke TypeScript compilation
  - Line 71 had literal `\n` instead of actual newline
  - Now compiles cleanly

## [1.21.0] - 2026-01-05

### Fixed
- **Critical fix**: Use proper Seanime system API `$os.cmd("open", url)` instead of non-existent `ctx.openUrl()`
  - Added `system` scope to plugin permissions
  - Added `open` command to commandScopes for URL opening
  - Fully compliant with Seanime plugin documentation
  - Properly waits for command execution before returning

## [1.20.0] - 2026-01-05

### Fixed
- **Attempted fix**: Replaced `$osExtra.asyncCmd()` with `ctx.openUrl()` 
  - `$osExtra` was not available in plugin context
  - `ctx.openUrl()` does not exist in Seanime API
  - Removed unnecessary commandScopes from manifest

## [1.19.1] - 2026-01-05

### Fixed
- **Hotfix**: Resolved TypeScript compilation error caused by mismatched quotes in `MAL.ts`
  - Fixed error: `[Expected ")" but found "Anime"]`

## [1.19.0] - 2026-01-05

### Fixed
- **Critical fix**: Moved `$osExtra.asyncCmd()` execution to main plugin scope (outside onClick handler)
  - Resolves context scope issues where `$osExtra` was undefined in nested async handlers
  - Improves reliability of opening MAL links
  - Better error handling with detailed logging

### Improved
- Enhanced error messages and logging for debugging
- More robust command execution flow

---

## [1.18.0] - Previous Release

For previous versions, see git history.
