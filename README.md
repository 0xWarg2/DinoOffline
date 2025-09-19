# Offline Dinosaur Redux

This is a Phaser 3 rebuild of the offline dinosaur platformer, bundled with Vite for a modern development workflow. The project keeps the retro pixel aesthetic and vertical platforming loop while reorganising the codebase into small, maintainable modules.

## Getting Started

1. Install dependencies (generates `package-lock.json`):
   ```bash
   npm install
   ```
2. Start the dev server with hot reload at <http://localhost:5173>:
   ```bash
   npm run dev
   ```
3. Create a static production build in `dist/`:
   ```bash
   npm run build
   ```
4. Preview the production build locally:
   ```bash
   npm run preview
   ```

## Project Structure

```
project
├── index.html          # Vite entry point
├── public/
│   └── assets/images/  # Pixel art and sprites
├── src/
│   ├── config/         # Shared constants
│   ├── objects/        # Game entities (Player, etc.)
│   ├── scenes/         # Phaser scenes (Boot/Menu/Game)
│   ├── ui/             # Reserved for UI components
│   ├── utils/          # Helpers (random, score manager)
│   └── main.js         # Phaser bootstrap
└── README.md
```

## Controls

- `←` / `A`: Move left
- `→` / `D`: Move right
- `↑` / `W` / `Space`: Jump / start game
- `↓` / `S`: Duck (on a platform)

The game speeds up every "day" cycle, swaps colours for day/night, and records your best score in `localStorage`.

## Next Steps

- Add sound effects and music using Phaser's audio APIs
- Bring in sprite atlases for tighter hit boxes if needed
- Expand with new enemy types or power-ups

