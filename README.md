# MAL Button - Seanime Extension

![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)

A lightweight Seanime plugin that adds a convenient button to open the current anime on **MyAnimeList** directly from the anime details page.

## Features

✨ **One-Click Access** - Jump to MAL with a single click  
🚀 **Zero Configuration** - Install and use immediately  
📱 **Lightweight** - Minimal overhead, pure TypeScript  
🔗 **Smart Linking** - Uses AniList's external links to find MAL ID

## Installation

### Method 1: Seanime Extension Manager (Recommended)

1. Open **Seanime**
2. Go to **Settings** → **Extensions** → **Install Extension**
3. Paste this manifest URL:
   ```
   https://raw.githubusercontent.com/bruuhim/MAL-Button-Seanime/refs/heads/main/src/manifest.json
   ```
4. Click Install
5. Restart Seanime

### Method 2: Manual Installation

1. Clone this repository or download the files
2. Copy the `src/manifest.json` and `src/MAL.ts` files to your Seanime extensions folder
3. Restart Seanime

## Usage

1. Navigate to any anime details page in Seanime
2. Click the **"MAL"** button that appears
3. Your default browser opens the anime's MyAnimeList page

## How It Works

The plugin:
- Detects when you're on an anime page
- Retrieves the anime's MAL ID from AniList's external links data
- Opens the corresponding MAL URL: `https://myanimelist.net/anime/{id}`

## Troubleshooting

**Button doesn't appear?**
- Make sure you're on an anime details page (not manga or characters)
- Restart Seanime

**"Could not find MAL entry" error?**
- This anime might not be linked to MAL in AniList
- Try updating the anime data in Seanime

## Requirements

- **Seanime** (any recent version)
- **Internet connection**

## Permissions

This plugin requires **no special permissions** - it only uses:
- AniList API (already available in Seanime)
- System URL opener (to launch your browser)

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
- Toast messages: Modify `ctx.toast.success()` and `ctx.toast.alert()` calls
- URL format: Update the `malUrl` construction

## License

MIT - Feel free to use, modify, and distribute

## Author

**bruuhim** - [GitHub](https://github.com/bruuhim)

## Related Projects

- [Watch Order Seanime](https://github.com/Bas1874/Watch-Order-Seanime) - Another great Seanime extension
- [Seanime Documentation](https://seanime.gitbook.io/) - Official Seanime docs

---

**Enjoy quick MAL access!** ✨
