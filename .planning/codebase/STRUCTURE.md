# Structure: Apex Tracker

**Analyzed:** 2026-09-03 (Vue 3 rewrite - supersedes the pre-v1.0 React analysis)

## Directory Layout

```
apextracker/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── favicon.ico / favicon.png
│   ├── backgrounds/default.jpg
│   └── images/legends/*.png          # Legend character images
│
├── src/
│   ├── components/
│   │   ├── legends/                  # FavoriteLegends.vue, LegendCard.vue
│   │   ├── search/                   # SearchInput, PlatformSelect, SearchButton
│   │   ├── stats/                    # PlayerHeader, StatsList
│   │   ├── ui/                       # Base* primitives, ErrorMessage, LoadingSpinner, etc.
│   │   │                             # (also 4 dead/unreferenced files - see CONVENTIONS.md)
│   │   └── visual/                   # AppBackground.vue
│   │
│   ├── composables/                  # useApiCache, useLazyImage, usePageTitle
│   ├── router/index.js               # Route table + nav guard
│   ├── stores/                       # player.js, search.js, ui.js (Pinia)
│   ├── style/                        # base.css, transitions.css, _variables.css
│   ├── utils/                        # api.js, cache.js, constants.js, backgrounds.js, platformIcons.js
│   ├── views/                        # HomeView, PlayerView, NotFoundView
│   ├── App.vue
│   ├── main.js
│   └── style.css
│
├── .env.example                      # Template for VITE_APEX_API_KEY
├── vite.config.js
├── vitest.config.js
├── package.json
└── package-lock.json
```

## Key Locations

| Purpose | Location |
|---------|----------|
| Root component | `src/App.vue` |
| Entry point | `src/main.js` |
| Routes | `src/router/index.js` |
| State | `src/stores/` |
| API integration | `src/utils/api.js`, `src/utils/constants.js` |
| Shared cache logic | `src/utils/cache.js`, `src/composables/useApiCache.js` |
| Component library | `src/components/ui/` |
| Global styles | `src/style.css`, `src/style/` |

## Naming Conventions

See CONVENTIONS.md for component/composable/store naming patterns.

## Imports

Absolute imports via the `@` alias (`@/utils/constants`, `@/stores/player`), configured in `vite.config.js`'s `resolve.alias`. Relative imports (`./ComponentName.vue`) only for same-directory siblings.

## Public vs Src

| Directory | Purpose | Build Process |
|-----------|---------|----------------|
| `public/` | Static assets (legend images, manifest, favicon) | Copied as-is |
| `src/` | Application code | Bundled/transformed by Vite |

## Not Present

- No `src-react/` (removed - was the pre-v1.0 legacy implementation, fully superseded)
- No `dist/` tracked in git (build output, gitignored)
- No backend/server directory - this is a static frontend calling a third-party API directly
