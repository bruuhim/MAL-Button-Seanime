# MAL Button - Seanime Plugin

<div align="center">
  <img src="src/icon.png" alt="MAL Button Icon" width="128" height="128" />
  <h3>🚀 Quick MyAnimeList Access for Seanime</h3>
  <p>One-click access to MyAnimeList from your anime & manga pages</p>

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-1.0.18-green.svg)
[![Seanime](https://img.shields.io/badge/seanime-3.2.0+-purple.svg)](https://github.com/5rahim/seanime)

</div>

---

## ✨ Features

- **🎯 Native Integration** - Seamlessly integrates into Seanime's UI with a native-style button
- **⚡ Fast Loading** - Optimized to appear in ~500ms with smart retry logic
- **📺 Anime & Manga Support** - Works on both anime and manga detail pages
- **🔗 Direct Links** - Opens the corresponding MyAnimeList page in a new tab
- **🎨 Clean Design** - Uses the official MAL logo with Seanime's styling
- **🛡️ Robust** - Handles edge cases, React re-renders, and API errors gracefully

---

## 🖼️ Preview

<div align="center">
  <img src="assets/Screenshot-After.png" alt="MAL Button in action" width="80%" />
  <p><i>The MAL button appears next to the AniList button in the action bar</i></p>
</div>

---

## 📦 Installation

### From Seanime Extensions Marketplace

1. Open **Seanime** → Navigate to **Extensions**
2. Search for **"MAL Button"**
3. Click **Install**
4. The button will appear automatically on anime/manga pages!

### Manual Installation

1. Download the latest release from [GitHub](https://github.com/bruuhim/MAL-Button-Seanime)
2. In Seanime, go to **Extensions** → **Development**
3. Click **Install from URL** and paste:
   ```
   https://raw.githubusercontent.com/bruuhim/MAL-Button-Seanime/refs/heads/main/src/manifest.json
   ```

---

## 🎯 Usage

1. Navigate to any **Anime** or **Manga** detail page in Seanime
2. Look for the **MAL** button in the action bar (next to the AniList button)
3. Click it to open the corresponding MyAnimeList page in a new tab

**Note:** The button only appears if the anime/manga has a MyAnimeList entry.

---

## 🛠️ How It Works

### Smart DOM Injection
- Uses Seanime's `ctx.dom` API to safely inject the button
- Waits for the action bar container to be ready (500ms initial delay)
- Retries every 500ms if the DOM isn't ready yet
- Removes duplicate buttons automatically

### Data Flow
1. **Navigation Detection** - Listens to `ctx.screen.onNavigate`
2. **Entry Fetching** - Gets anime/manga data via `ctx.anime.getAnimeEntry()` or `ctx.manga.getMangaEntry()`
3. **MAL ID Extraction** - Checks if `media.idMal` exists
4. **Button Injection** - Creates and injects the MAL button next to the AniList button

### Performance
- **Initial delay:** 500ms (optimized for fast loading)
- **Retry interval:** 500ms (if DOM not ready)
- **Button appears:** Usually within 0.5-1 second

---

## 🔧 Development

### Project Structure

```
MAL-Button-Seanime/
├── src/
│   ├── MAL.ts           # Main plugin logic
│   ├── manifest.json    # Plugin metadata
│   ├── icon.png         # Plugin icon
│   ├── app.d.ts         # Seanime app type definitions
│   ├── core.d.ts        # Core type definitions
│   ├── plugin.d.ts      # Plugin API type definitions
│   └── system.d.ts      # System type definitions
├── assets/
│   ├── Preview-01.png   # Screenshot 1
│   ├── Preview-02.png   # Screenshot 2
│   └── Screenshot-After.png  # Main preview
├── README.md
├── LICENSE
└── package.json
```

### Building

This plugin is written in TypeScript and uses Seanime's plugin system. No build step is required - Seanime compiles TypeScript plugins automatically.

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 Changelog

### v1.0.18 (Latest)
- ⚡ **Performance:** Reduced initial delay from 2s to 500ms
- ⚡ **Performance:** Reduced retry increment from 2s to 500ms
- 🚀 Button now appears 4x faster!

### v1.0.17
- 🔄 Complete sync with developer's PR version
- ✅ Stable release with proper TypeScript definitions

### v1.0.1
- 🐛 Fixed handling of "GoError: no cached data available"
- 🔧 Improved robustness when switching between Anime/Manga

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🙏 Credits

- Original concept and implementation by [bruuhim](https://github.com/bruuhim)
- Optimizations and improvements by [nnotwen](https://github.com/nnotwen)
- Built for [Seanime](https://github.com/5rahim/seanime) by 5rahim

---

<div align="center">
  <p>Made with ❤️ for the Seanime community</p>
  <p>If you find this useful, please ⭐ the repo!</p>
  
  <a href="https://github.com/bruuhim/MAL-Button-Seanime/issues">Report Bug</a>
  ·
  <a href="https://github.com/bruuhim/MAL-Button-Seanime/issues">Request Feature</a>
</div>
