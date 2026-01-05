# ⚠️ ARCHIVED - See bruuhim/mal-button

This repository is superseded by the production-ready version: **[bruuhim/mal-button](https://github.com/bruuhim/mal-button)**

## Migration Information

**v1.22.3 was a development version.** The API limitations have been overcome with proper UI design!

### What Was the Problem?

v1.22.3 attempted to use clipboard APIs (`window.navigator.clipboard`) which don't exist in Seanime's sandboxed JS engine.

### The Solution

v1.0.0 uses Seanime's native **Tray UI components** to display a selectable link that users can long-press to copy. This is a clean, native approach that works within Seanime's constraints.

## New Repository: bruuhim/mal-button

🎯 **[bruuhim/mal-button](https://github.com/bruuhim/mal-button)** - Production-ready v1.0.0

### Features

✨ **One-Click MAL Access** - Click the MAL button on any anime page  
🔗 **Smart Link Resolution** - Uses AniList's idMal + external links fallback  
📋 **Clean UI** - Displays anime title and selectable MAL link  
⚡ **Fast & Reliable** - No external API calls, uses Seanime's built-in AniList integration  
📖 **Comprehensive Docs** - Full README with troubleshooting and roadmap  

## Installation

Head to **[bruuhim/mal-button](https://github.com/bruuhim/mal-button)** for the latest version.

## What's New in v1.0.0?

✅ Restructured codebase  
✅ Enhanced error handling  
✅ Comprehensive documentation  
✅ TypeScript definitions included  
✅ Production-ready implementation  
✅ Proper Seanime API usage  
✅ Toast notifications  

---

**This beta repo is archived. Please use the new production repository for all future updates and support.**
