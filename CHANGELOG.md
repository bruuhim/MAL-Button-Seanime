# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
