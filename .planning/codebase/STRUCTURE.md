# Structure: Apex Tracker

**Analyzed:** 2026-02-04

## Directory Layout

```
apextracker/
├── public/
│   ├── index.html          # HTML template
│   ├── manifest.json       # PWA manifest
│   └── favicon.ico
│
├── src/
│   ├── components/         # React components
│   │   ├── AnimateAll.js
│   │   ├── Background.js
│   │   ├── Error.js
│   │   ├── FavCard.js
│   │   ├── Input.js
│   │   ├── InputContainer.js
│   │   ├── PlatformIcons.js
│   │   ├── PlaystationSVG.js
│   │   ├── SearchButton.js
│   │   ├── Seperator.js
│   │   ├── StatCard.js
│   │   ├── UserInfoBlock.js
│   │   ├── WindowsSVG.js
│   │   └── XboxSVG.js
│   │
│   ├── images/            # Legend character backgrounds
│   │   ├── bangalore.png
│   │   ├── bloodhound.png
│   │   ├── caustic.png
│   │   ├── crypto.png
│   │   ├── gibraltar.png
│   │   ├── lifeline.png
│   │   ├── mirage.png
│   │   ├── octane.png
│   │   ├── pathfinder.jpg
│   │   ├── wattson.png
│   │   └── wraith.png
│   │
│   ├── App.js             # Main application component
│   ├── App.css            # App styles
│   ├── App.test.js        # App tests
│   ├── index.js           # Entry point
│   ├── index.css          # Global styles
│   ├── serviceWorker.js   # PWA service worker
│   ├── utils.js           # Shared utilities (icons, backgrounds, helpers)
│   └── _mixins.js         # Media query breakpoints
│
├── package.json           # Dependencies and scripts
└── package-lock.json
```

## Key Locations

| Purpose | Location |
|---------|----------|
| Root component | `src/App.js` |
| Component directory | `src/components/` |
| Shared utilities | `src/utils.js` |
| Static images | `src/images/` |
| Entry point | `src/index.js` |
| Global styles | `src/index.css` |
| Media queries | `src/_mixins.js` |

## Naming Conventions

**Files:**
- Components: PascalCase (`StatCard.js`, `UserInfoBlock.js`)
- Utilities: camelCase (`utils.js`, `_mixins.js`)
- Utilities starting with underscore are internal-only

**Components:**
- Default exports for components
- Styled components named after file (e.g., `StatCardWrapper`)
- Props are camelCase (`bgData`, `toggleDisplay`, `rerenderAnimate`)

**Variables:**
- camelCase for variables (`iconIndex`, `platformCode`)
- UPPER_CASE for constants (`myHeaders`)
- Descriptive names: `legendStats`, `playerStats`, `favStats`

## File Organization

**Co-located:** Images with components that use them (legend backgrounds in `src/images/`)

**Separated:** Components in dedicated directory, utilities at root level

## Imports

**Relative paths used throughout:**
- `./components/ComponentName` for sibling components
- `./images/filename` for images
- `../utils.js` for utilities (from components)

## Public vs Src

| Directory | Purpose | Build Process |
|-----------|---------|---------------|
| `public/` | Static assets, HTML template | Copied as-is |
| `src/` | Application code, images | Bundled by CRA |
