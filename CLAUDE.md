# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

re-start is a TUI-style browser startpage built with Svelte 5. It's designed as a browser extension that replaces the new tab/homepage with a customizable dashboard featuring:

- Todoist tasks integration
- Weather display (Open-Meteo API)
- Customizable quick links
- Live stats (load time, ping, FPS, viewport size)
- Lightweight performance (&lt;90kb, loads in &lt;50ms)

## Development Commands

```bash
# Start development server (runs at http://localhost:5173)
npm run dev

# Build for production (creates dist/ folder)
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

## Architecture

### Core Structure
- **Entry point**: `src/main.js` mounts the Svelte app
- **Root component**: `src/App.svelte` orchestrates the main layout
- **Component library**: `src/lib/components/` contains modular widgets
- **State management**: `src/lib/settings-store.svelte.js` handles persistent settings
- **API integrations**: `src/lib/todoist-api.js` and `src/lib/weather-api.js`

### Key Components
- `Clock.svelte` - Time display with 12/24hr format support
- `Weather.svelte` - Weather widget using Open-Meteo API
- `Todoist.svelte` - Task integration requiring API token
- `Links.svelte` - Customizable bookmark grid
- `Stats.svelte` - Performance metrics display
- `Settings.svelte` - Configuration modal

### Settings System
Settings are stored in localStorage and managed through Svelte 5's reactive state system (`$state`). The settings store provides defaults and handles persistence automatically. Key settings include:
- Time format (12hr/24hr)
- Todoist API token
- Weather location (lat/lng)
- Temperature/speed units
- Link configuration

### Browser Extension Build
The project builds as a browser extension with:
- `public/manifest.json` - Extension manifest (v3)
- Different installation processes for Firefox vs Chrome/Edge
- Chrome requires removing `chrome_settings_overrides` from built manifest

### Styling
Uses CSS custom properties for theming with a minimal, terminal-inspired design. Global styles in `src/app.css`, component styles are scoped.

## Development Notes

- Uses Svelte 5 with modern `$state` reactives (not Svelte 4 stores)
- Vite configuration injects version from manifest.json at build time
- No testing framework configured
- No linting/formatting commands beyond Prettier config
- Extension loads offline after build (no external dependencies at runtime)