# Concerns: Apex Tracker

**Analyzed:** 2026-09-03 - supersedes the pre-v1.0 React analysis (all of that was fixed in the Vue rewrite)

## Resolved Since Last Analysis

The React-era findings (hardcoded key, Heroku proxy dependency, global `window` access, magic numbers, empty catch blocks, no routing, no caching) no longer apply - `src-react/` was deleted this session and none of that code is live. Current concerns below are specific to the Vue app.

## External Dependency Risk

**Unofficial, no-SLA API** - the app depends entirely on `apexlegendsapi.com` (mozambiquehe.re), a solo-maintained community project with no uptime guarantee and no published commercial-use terms. If it goes down or changes its response shape, the app has no fallback. See INTEGRATIONS.md for the full rationale (Tracker.gg, the previous provider, turned out to require production-use approval that never materialized).

**Rate-limit quirk** - the API sometimes returns HTTP 200 instead of 429 when rate-limited, which `api.js` can't fully detect.

## No License

Public GitHub repo with no `LICENSE` file and no `"license"` field in `package.json` - defaults to all-rights-reserved, which may not be the intent for a public repo.

## Minimal Test Coverage

Vitest is now configured (added this session) but only 2 smoke-test files exist (`constants.test.js`, `BaseButton.test.js`). No coverage for:
- `stores/player.js` - the highest-risk file, has the caching/staleness/error-handling logic and the API response transform
- `utils/api.js` - fetch error handling, status code branches
- Any other component

## Dead Code

`src/components/ui/PlatformIcons.vue`, `WindowsSVG.vue`, `PlaystationSVG.vue`, `XboxSVG.vue` are unreferenced anywhere in the live app (the app actually uses `src/utils/platformIcons.js`'s inline SVG strings instead). Not removed this session - out of scope, but a clear future cleanup candidate similar to `src-react/`.

## Minor / Cosmetic

- Every build generates an empty `vendor` chunk (`vite.config.js`'s `manualChunks` always creates the bucket even though no non-Vue/VueUse `node_modules` code ships to the client anymore).
- CSS variable naming inconsistency noted in the v1.0 milestone audit (some components use `--color-*` instead of the defined `--text-*`/`--bg-*` variables) - not verified/re-audited this session.

## Accessibility

Not re-audited this session; the v1.0 milestone notes claim ARIA labels and keyboard navigation were addressed during the Vue rewrite, but this hasn't been independently re-verified against the current DOM.
