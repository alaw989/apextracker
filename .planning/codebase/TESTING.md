# Testing: Apex Tracker

**Analyzed:** 2026-09-03 - Vitest added this session; supersedes the pre-v1.0 CRA/Jest analysis

## Test Framework

**Framework:** Vitest 5, with `@vue/test-utils` for component mounting and `jsdom` as the DOM environment.
**Config:** `vitest.config.js` (kept separate from `vite.config.js` via `mergeConfig`, so test config doesn't mix with the build's argv-sniffed `visualizer` plugin logic).
**Scripts:** `npm test` (single run), `npm run test:watch` (watch mode).
**Convention:** test files live next to the code they test (`constants.test.js` beside `constants.js`), not in a separate `__tests__/` tree.

## Current Coverage

| File | Test File | Coverage |
|------|-----------|----------|
| `src/utils/constants.js` | `constants.test.js` | `getPlatformById`, `getPlatformIds`, `PLATFORMS` length |
| `src/components/ui/BaseButton.vue` | `BaseButton.test.js` | slot render, click emit, disabled/loading suppress emit |
| Everything else | none | - |

8 tests total, all passing (`npm test`).

## Suggested Next Priorities

1. **`src/stores/player.js`** - highest-value target. Covers `transformApiData()` (the apexlegendsapi.com response → app-shape transform, including the top-2-legends-by-kills sort), the stale-while-revalidate cache flow in `searchPlayer()`/`fetchPlayer()`, and error handling. Use `@pinia/testing`'s `createTestingPinia()`.
2. **`src/utils/api.js`** - mock `global.fetch` to exercise the 404/429/403 branches and the `data.Error` 200-body-error case.
3. **`src/composables/useApiCache.js`** - TTL/staleness logic, isolated from the store.
4. Remaining `ui/`, `search/`, `stats/`, `legends/` components as time allows.

## Mocking Notes

- Mock `global.fetch` directly (`vi.stubGlobal('fetch', ...)`) rather than a library like MSW, to keep the dependency footprint small - matches the project's existing "few dependencies" style.
- `useApiCache` reads/writes `localStorage` directly; jsdom provides a working `localStorage` implementation, no mocking needed for that part.
