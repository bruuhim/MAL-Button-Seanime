# Changelog

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
