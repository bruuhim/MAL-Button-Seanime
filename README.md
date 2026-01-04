# MAL Button - Seanime Extension

![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.1.0-brightgreen)

A lightweight Seanime plugin that adds a convenient button to open the current anime on **MyAnimeList** directly from the anime details page.

## Features

✨ **One-Click Access** - Jump to MAL with a single click  
🚀 **Zero Configuration** - Install and use immediately  
📱 **Lightweight** - Minimal overhead, pure TypeScript  
🔗 **Smart Linking** - Uses AniList's external links to find MAL ID  
✅ **Confirmation Modal** - Verify before opening external link

## Installation

### Method 1: Seanime Extension Manager (Recommended)

1. Open **Seanime**
2. Go to **Settings** → **Extensions** → **Installed**
3. Click **Add extensions** (button in top right)
4. Paste this manifest URL:
   ```
   https://raw.githubusercontent.com/bruuhim/MAL-Button-Seanime/refs/heads/main/src/manifest.json
   ```
5. Click Install
6. Restart Seanime

### Method 2: Manual Installation

1. Clone this repository or download the files
2. Copy the `src/manifest.json` and `src/MAL.ts` files to your Seanime extensions folder
3. Restart Seanime

## Usage

1. Navigate to any anime details page in Seanime
2. Click the **"MAL"** button that appears
3. A confirmation modal appears showing the anime title
4. Click **"Open MAL"** to open the anime's MyAnimeList page in your browser
5. Or click **"Cancel"** to dismiss

## What's New (v1.1.0)

✅ **Fixed URL opening** - Now uses proper tray-based approach (same as Watch Order extension)  
✅ **Confirmation modal** - Shows which anime you're about to open  
✅ **Better UX** - Clear visual feedback before opening external links

## How It Works

The plugin:
- Detects when you're on an anime page
- Retrieves the anime's MAL ID from AniList's external links data
- Shows a confirmation modal with the anime title
- Opens the corresponding MAL URL: `https://myanimelist.net/anime/{id}`

## Troubleshooting

**Button doesn't appear?**
- Make sure you're on an anime details page (not manga or characters)
- Restart Seanime
- Check that the extension is installed in Extensions → Installed

**"Could not find MAL entry" error?**
- This anime might not be linked to MAL in AniList
- Try updating the anime data in Seanime
- Check if the anime exists on MyAnimeList

**Clicking the button does nothing?**
- Check that Seanime is updated to the latest version
- Try reinstalling the extension: Remove it and reinstall via the manifest URL
- Click "Check for updates" in Extensions panel

## Requirements

- **Seanime** (latest version recommended)
- **Internet connection**

## Permissions

This plugin requires **no special permissions** - it only uses:
- AniList API (already available in Seanime)
- System URL/browser opener (to open MAL in your browser)

## Development

### File Structure
```
.
├── src/
│   ├── manifest.json    # Plugin metadata
│   └── MAL.ts           # Main plugin code
├── README.md
└── LICENSE
```

### Building

No build step needed - TypeScript is compiled by Seanime at runtime.

### Modifying

Edit `src/MAL.ts` to customize:
- Button label: Change `"MAL"` in `newAnimePageButton({ label: "MAL" })`
- Toast messages: Modify `ctx.toast.alert()` calls
- Confirmation text: Update the tray modal text
- URL format: Modify the `malUrl` construction

## Updates

**Seanime automatically checks for updates** in the Extensions panel. Click "Check for updates" to get the latest version with fixes and improvements.

### Version History

**v1.1.0** (2026-01-04)
- Fixed URL opening using tray-based approach
- Added confirmation modal
- Better error handling

**v1.0.0** (2026-01-04)
- Initial release

## License

MIT - Feel free to use, modify, and distribute

## Author

**bruuhim** - [GitHub](https://github.com/bruuhim)

## Related Projects

- [Watch Order Seanime](https://github.com/Bas1874/Watch-Order-Seanime) - Another great Seanime extension
- [Seanime Documentation](https://seanime.gitbook.io/) - Official Seanime docs
- [Seanime Extensions](https://seanime.gitbook.io/seanime-extensions/) - Plugin development guide

---

**Enjoy quick MAL access!** ✨
