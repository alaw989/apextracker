# Architecture: Apex Tracker

**Analyzed:** 2026-09-03 (Vue 3 rewrite - supersedes the pre-v1.0 React analysis)

## Pattern

**Architecture Type:** Single Page Application (SPA), no backend
**Pattern:** Composition API components + Pinia stores for state
**Data Flow:** Unidirectional - components call store actions, stores fetch/cache and expose reactive state back down

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      Views (route targets)                    │
│  HomeView (search form)  │  PlayerView (profile)  │ NotFound  │
└─────────────────────────────────────────────────────────────┘
                            │ uses
┌─────────────────────────────────────────────────────────────┐
│                        Components                              │
│  search/  stats/  legends/  ui/  visual/                      │
└─────────────────────────────────────────────────────────────┘
                            │ reads/calls
┌─────────────────────────────────────────────────────────────┐
│                     Pinia Stores (state)                       │
│  player.js (data+cache)  search.js  ui.js                     │
└─────────────────────────────────────────────────────────────┘
                            │ calls
┌─────────────────────────────────────────────────────────────┐
│              Composables + Utils (framework-free)              │
│  useApiCache, useLazyImage, usePageTitle │ api.js, cache.js    │
└─────────────────────────────────────────────────────────────┘
                            │ fetch()
┌─────────────────────────────────────────────────────────────┐
│                   apexlegendsapi.com                          │
│   (via Vite dev proxy - real browser CORS is blocked by WAF)  │
└─────────────────────────────────────────────────────────────┘
```

## Key Modules

| Module | Location | Responsibility |
|--------|----------|-----------------|
| App.vue | `src/App.vue` | Root component - router-view + global chrome |
| Router | `src/router/index.js` | 3 routes, platform-validating nav guard |
| player store | `src/stores/player.js` | Fetches, caches, and transforms player data |
| search store | `src/stores/search.js` | Search form state |
| ui store | `src/stores/ui.js` | Global error/UI state |
| useApiCache | `src/composables/useApiCache.js` | Stale-while-revalidate localStorage cache |
| useLazyImage | `src/composables/useLazyImage.js` | IntersectionObserver-based lazy image loading |
| usePageTitle | `src/composables/usePageTitle.js` | Dynamic `<title>` per route |
| api.js | `src/utils/api.js` | Fetch wrapper for apexlegendsapi.com |
| constants.js | `src/utils/constants.js` | Platform list, API config, error messages |
| cache.js | `src/utils/cache.js` | Raw localStorage LRU cache (max 10 entries) |

## Data Flow

1. **User Input** → `SearchInput` + `PlatformSelect` capture username + platform (`PC`/`X1`/`PS4`/`SWITCH`)
2. **Store Action** → `playerStore.searchPlayer()` checks localStorage cache first (stale-while-revalidate), then calls `fetchPlayerStats()` in `api.js`
3. **API Call** → `fetch()` to `/api/bridge?player=...&platform=...&auth=...&merge=true`, proxied by Vite's dev server to `https://api.mozambiquehe.re/bridge` (a direct browser call gets blocked by the API's WAF despite its `Access-Control-Allow-Origin: *` header - see INTEGRATIONS.md)
4. **Transform** → `player.js`'s `transformApiData()` reshapes the raw response (`global`, `legends`, `total`) into `{ name, avatar, rankIcon, stats, legends }`, sorting legends by kills and taking the top 2
5. **Render** → `PlayerView.vue` reads reactive store state via `storeToRefs`

## State Management

Pinia setup-store syntax (Composition API) throughout, not the options-store style. Each store returns `{ state, getters, actions }` from its `defineStore(() => {...})` callback.

## Entry Points

| Entry | Location | Purpose |
|-------|----------|---------|
| `index.html` | root | Vite entry, mounts `#app` |
| `src/main.js` | Application bootstrap | Creates Vue app, installs Pinia + router |
| `src/App.vue` | Root component | `<RouterView>` host |

## Build

Vite 6, esbuild minification, manual chunk splitting (`vue-vendor` for vue/pinia/vue-router, `vueuse` separate, `vendor` catch-all - currently empty since no other node_modules deps ship to the client). Target `es2015`. Dev-time proxy (`/api` → `api.mozambiquehe.re`) is required for the app to fetch data at all - see INTEGRATIONS.md.
