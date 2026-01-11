# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2026-01-10

### Added
- **DOM Injection**: Directly injects the MAL button into the Seanime UI next to the AniList button (bypassing the tray).
- **Seamless Integration**: Replicates native button styling for a perfect look.

## [2.1.0] - 2026-01-10

### Optimized
- **Improved Type Safety**: Adopted `$app.AL_BaseAnime` types as per community recommendation.
- **Efficient Logic**: Simplified `getMalId` to rely on `media.idMal` directly, removing redundant deep checking.

## [2.0.2] - 2026-01-10

### Changed
- Added preview images to README from assets.
- Final version bump for project closure.

## [2.0.0] - 2026-01-10

### Added
- **Major UI Overhaul**: New premium tray design with glassmorphism effects.
- **Enhanced UX**: Large, clear action buttons for direct browser opening.
- **Improved Loading States**: Subtle pulse animations while fetching data.
- **Robustness**: Enhanced data fetching logic to handle sparse metadata.

### Changed
- Complete refactor of the core integration for better performance.
- Consolidated state management.
- Simplified manifest by removing experimental system permissions.

## [1.0.0] - 2026-01-05

### Added
- Initial stable production release.
- Full TypeScript implementation with proper interfaces.
- Robust MAL ID resolution using direct ID + external links.
- Loading and error state management for better UX.
- User-friendly tray UI with clear copy instructions.
- Comprehensive README with usage, development, and troubleshooting sections.

### Changed
- Complete refactor of legacy beta code.
- Simplified plugin manifest for production usage.
- Improved toast messages for status feedback.

### Removed
- Any attempt to access `window` or browser-specific APIs.
- Clipboard hacks that are not supported in Seanime's sandbox.

## [0.1.0-beta] - 2025-xx-xx

### Added
- Experimental MAL button extension for Seanime (development-only).
