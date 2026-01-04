⚠️ # ARCHIVED - MAL Button for Seanime

![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-ARCHIVED-red)

## Why This Is Archived

This plugin **does not work** due to fundamental Seanime plugin sandbox limitations:

- ❌ Plugins cannot access `$os` (system commands)
- ❌ Plugins cannot access `__TAURI__` (desktop app APIs)  
- ❌ Plugins cannot open URLs or execute system operations
- ✅ Only core Seanime features (like AniDB/AniList buttons) have these permissions

### Investigation Log

1. **Plugin Approach** - Attempted to add a MAL button as a Seanime plugin
2. **Sandbox Discovery** - Realized plugins are sandboxed and can't open URLs
3. **Testing** - v1.18.0 attempted `$os.cmd("open", url)` but failed: `$os is not defined`
4. **Solution** - Filed feature request on Seanime: [Add MyAnimeList button to anime pages](https://github.com/5rahim/seanime/issues/new?template=feature_request.md)
5. **Recommendation** - Native implementation in Seanime core is the proper solution

## What Should Happen Instead

A native MAL button (like the existing "Open on AniDB" button) should be added to Seanime core with:
- Full access to system APIs
- Proper error handling  
- Consistent UX with other quick-action buttons

---

## Original Project (For Reference)

# MAL Button - Seanime Extension

A lightweight Seanime plugin that adds a convenient button to open the current anime on **MyAnimeList** directly from the anime details page.

### Features

✨ **One-Click Access** - Jump to MAL with a single click  
🚀 **Zero Configuration** - Install and use immediately  
📱 **Lightweight** - Minimal overhead, pure TypeScript  
🔗 **Smart Linking** - Uses AniList's external links to find MAL ID  
✅ **Confirmation Modal** - Verify before opening external link

### Installation

⚠️ **Note: This will not work due to plugin sandbox limitations** ⚠️

The plugin code is preserved here as documentation of the investigation process.

### How It Was Supposed to Work

The plugin:
- Detects when you're on an anime page
- Retrieves the anime's MAL ID from AniList's external links data
- Shows a confirmation modal with the anime title
- Opens the corresponding MAL URL: `https://myanimelist.net/anime/{id}`

### Version History

**v1.18.0** (2026-01-04)
- Attempted to use `$os.cmd("open", url)` for URL opening
- Failed due to plugin sandbox restrictions
- Marked as archived

**v1.1.0** (2026-01-04)
- Added confirmation modal
- Better error handling

**v1.0.0** (2026-01-04)
- Initial release

### License

MIT - Feel free to use, modify, and distribute

### Author

**bruuhim** - [GitHub](https://github.com/bruuhim)

---

**Proper solution coming via Seanime core feature request** ☝️