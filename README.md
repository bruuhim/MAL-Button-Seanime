# MAL Button - Seanime Plugin

<div align="center">
  <img src="src/icon.png" alt="MAL Button Icon" width="128" height="128" />
  <h3>🚀 Quick MyAnimeList Access for Seanime</h3>
  <p>Premium one-click MAL links directly from anime details page</p>

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.2.1-blue.svg)](CHANGELOG.md)
[![Seanime](https://img.shields.io/badge/seanime-2.7.0+-purple.svg)](https://github.com/5rahim/seanime)
</div>

---

## 📋 Features

✅ **Premium Tray UI** - Modern, polished popup with glassmorphism aesthetics  
✅ **One-Click Access** - Instant MAL link resolution  
✅ **Smart ID Resolution** - Robust multi-source discovery for MAL IDs  
✅ **Smooth Transitions** - Animated hover effects and loading states  
✅ **Production Grade** - Highly optimized, stable, and sandbox-safe  

---

## 🎯 How to Use

### Installation

1. **Open Seanime Extensions**
   - Go to Settings → Extensions → Marketplace

2. **Find MAL Button**
   - Search for "MAL Button" or "MyAnimeList"
   - Click Install

### Usage

1. **Navigate to an anime details page**
2. **Click the "MAL" button** in the action bar
3. **A premium tray opens** with a direct "Open MyAnimeList" action
4. **Click the button** to open MAL in your default browser

---

## 🛠️ How It Works

### MAL ID Resolution Priority

The plugin uses a recursive strategy to ensure the link is found:

```
1. Direct Metadata Check
   └─> media.idMal

2. Deep Entity Scrutiny
   └─> ctx.anime.getAnimeEntry()

3. External Link Mapping
   └─> externalLinks.find("myanimelist")
```

### State Management

```typescript
interface MALState {
  url: string | null           // Current MAL URL
  animeName: string | null     // Anime title
  isLoading: boolean          // API call in progress
  error: string | null        // Error message if any
}
```

### Error Handling

- Invalid anime IDs → "No MAL ID found"
- API failures → "Error: [details]"
- Missing data → Graceful fallbacks

---

## 🏗️ Architecture

```
src/
├── MAL.ts           # Core Logic & Premium UI (TypeScript)
├── manifest.json    # Metadata & Permissions
├── icon.png         # Plugin Icon
└── logo.png         # Repository Logo
```

### Key Functions

| Function | Purpose |
|----------|----------|
| `init()` | Plugin entry point |
| `getMalId()` | Resolve MAL ID from multiple sources |
| `malButton.onClick()` | Handle button click & fetch data |
| `malTray.render()` | Render tray UI with link |

---

## 🖼️ Previews

<div align="center">
  <img src="assets/preview01.png" alt="MAL Button Preview 1" width="400" />
  <img src="assets/preview02.png" alt="MAL Button Preview 2" width="400" />
</div>

---

## 📝 Changelog

### v2.0.2 (Final Polish)

🚀 **Final Release**: Added project previews and performed final code polish.  
🛠️ **Documentation**: Integrated asset previews into the repository.  

See [CHANGELOG.md](CHANGELOG.md) for full history.

## 🔧 Development

### Build Requirements

- TypeScript 4.0+
- Seanime 2.7.0+
- Node.js 16+ (for compilation)

### Local Testing

1. **Clone the repository**
   ```bash
   git clone https://github.com/bruuhim/MAL-Button-Seanime.git
   cd MAL-Button-Seanime
   ```

2. **Compile TypeScript** (optional, Seanime handles it)
   ```bash
   tsc src/MAL.ts --target es2020
   ```

3. **Test in Seanime Playground**
   - Paste `src/MAL.ts` content into Extensions → Playground
   - Test with different anime entries

### Adding Features

To extend this plugin:

1. **Add new state**
   ```typescript
   const newState = ctx.state<type>(defaultValue);
   ```

2. **Update `getMalId()`** for new sources

3. **Modify `malTray.render()`** for UI changes

---

## 🐛 Troubleshooting

### "No MAL ID found"

- Anime might not be indexed on MyAnimeList
- Check if it's a recent release
- Verify anime exists on [MAL directly](https://myanimelist.net)

### Long-press not working?

- This is expected — use **select + right-click → copy** instead
- Different platforms handle selection differently

### Plugin not showing?

1. Check Seanime Extensions → Installed
2. Verify manifest.json is valid
3. Restart Seanime completely
4. Check console for errors (Settings → Logs)

---

## 📚 API Reference

### Seanime Plugin APIs Used

```typescript
// UI
ctx.action.newAnimePageButton()  // Create button
ctx.newTray()                    // Create tray popup
ctx.toast.success()              // Show success message
ctx.toast.error()                // Show error message

// State
ctx.state<T>()                   // Create state variable
state.get()                      // Read state
state.set(value)                 // Update state

// API
ctx.anime.getAnimeEntry(mediaId) // Fetch anime data
```

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🤝 Contributing

Found a bug? Have an idea?  
Open an [issue](https://github.com/bruuhim/MAL-Button-Seanime/issues) or submit a PR!

**Contribution guidelines:**
- Follow existing code style (TypeScript)
- Add comments for non-obvious logic
- Test before submitting
- Update CHANGELOG.md

---

## 🔗 Links

- **Repository**: [github.com/bruuhim/MAL-Button-Seanime](https://github.com/bruuhim/MAL-Button-Seanime)
- **Seanime**: [github.com/5rahim/seanime](https://github.com/5rahim/seanime)
- **MyAnimeList**: [myanimelist.net](https://myanimelist.net)

---

<div align="center">
  <p>Made with ❤️ for anime fans</p>
  <p>If you find this useful, please ⭐ the repo!</p>
</div>
