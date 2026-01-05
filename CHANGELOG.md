# Changelog

## [1.22.2] - 2026-01-05

### Added
- **Click-to-copy functionality**: Click the URL button and it copies to clipboard
- Copy confirmation toast message
- Button changes color (green) when copied
- "Copied!" indicator appears below button

## [1.22.1] - 2026-01-05

### Fixed
- Display URL as selectable text with blue highlight
- Better UX: tap to select and copy

## [1.22.0] - 2026-01-05

### Major Refactor ✅ FIXED!
- **NEW APPROACH**: Display MAL link as clickable button in Seanime UI (tray)
- No system command execution needed - no permission issues!
- Click "MAL" button → Get MAL URL in tray popup
- Works perfectly with no authorization errors
- Simplified manifest (no permissions needed)

## [1.21.5] - 2026-01-05

### Attempted Fix
- Used Windows `start` command
- Still blocked by Seanime's command authorization

## [1.21.4] - 2026-01-05

### Attempted Fix
- Changed validator to `$ARGS`

## [1.21.3] - 2026-01-05

### Fixed
- Reverted to sync `$os.cmd()` API

## [1.21.2] - 2026-01-05

### Attempted Fix
- Tried adding `open` to `allow` list

## [1.21.1] - 2026-01-05

### Fixed
- Removed TypeScript compilation error

## [1.21.0] - 2026-01-05

### Initial System Command Attempt
- Used `$os.cmd("open", url)`

---

See git history for older versions.
