# Integrations: Apex Tracker

**Analyzed:** 2026-09-03 - switched providers this session; supersedes the Tracker.gg-based analysis

## External API: apexlegendsapi.com (mozambiquehe.re)

**Base URL:** `https://api.mozambiquehe.re/bridge`

**Auth:** query param, `auth={key}` (not a header) - key stored in `VITE_APEX_API_KEY`, read via `import.meta.env` in `src/utils/constants.js`. Real key lives in `.env.local` (gitignored); `.env.example` documents the variable name.

**Request shape:**
```
GET /bridge?player={username}&platform={PC|X1|PS4|SWITCH}&auth={key}&merge=true
```
`merge=true` is required - without it, the response's `legends.all.*` entries only carry `ImgAssets` (icon/banner), not stat trackers, for every legend except whichever one the player currently has equipped. With `merge=true`, every legend in `legends.all` gets a `data` array of tracker objects (`{name, value, key}`), which is what makes "top legends by kills" possible.

**Response shape (confirmed via live calls, not just docs):**
- `global.{name,avatar,platform,level,rank.{rankName,rankScore,rankImg}}` - player identity/rank
- `total.{kills,damage,wins,...}` - each an aggregate stat object `{name, value}`
- `legends.selected.LegendName` - currently-equipped legend
- `legends.all.<LegendName>.data[]` - per-legend tracker array (only present when `merge=true`), find the entry with `key === 'kills'` for kill count
- `legends.all.<LegendName>.ImgAssets.{icon,banner}` - legend artwork URLs
- 404-equivalent: HTTP 200 with `{"Error": "..."}` body, not a non-2xx status - `api.js` checks `data.Error` explicitly

**CORS: unreliable from real browsers, proxy required.** The API advertises `Access-Control-Allow-Origin: *` on some responses (curl, server-side `fetch`, direct navigation all succeed consistently), but a genuine browser-originated cross-origin `fetch()` - with the `Origin` and `Sec-Fetch-*` headers a real browser always sends - gets rejected with `406 Not Acceptable` and no CORS header at all, via the API's Cloudflare-fronted WAF. Confirmed with an actual user's browser, not just automated testing. Dev now routes through Vite's `server.proxy` (`vite.config.js`, `/api` → `https://api.mozambiquehe.re`) so the real request happens server-side, which reliably works. **Production will need an equivalent server-side proxy before this app can serve real users** - it cannot call the API directly from client-side code.

**Known quirks:**
- Rate limit (default 5 req/s) sometimes returns HTTP 200 instead of 429 when exceeded - a documented upstream bug. `api.js` checks for 429 but can't fully guard against this variant.
- Unofficial/community-maintained (solo maintainer, reachable via Discord), no uptime SLA.
- No published commercial-use terms found - worth confirming with the maintainer before relying on this for a monetized launch (see PROJECT.md's ads/affiliate plans).

## Dropped: Tracker.gg

Previously integrated (`https://public-api.tracker.gg/v2/apex/standard/profile/...`, header-based `TRN-Api-Key` auth). Dropped this session after confirming live:
- The old hardcoded key returns `401`.
- A freshly-generated key, confirmed correct on the tracker.gg dashboard, **also** returns `401` - real data access requires a separate production-use application/review, not just key creation.
- Their ToS explicitly bars commercial use, which conflicts with this project's stated ad/affiliate monetization plans (see PROJECT.md) even if an application were approved.
- No CORS support - would have needed a server-side proxy (the project's old Heroku proxy existed for exactly this reason).

No code path in the current app references Tracker.gg anymore.

## Static Assets

- Legend character images: `public/images/legends/*.png` (local, bundled)
- Legend icons/banners/rank images: served directly from `api.mozambiquehe.re/assets/...` (returned in API responses, not self-hosted)

## Data Flow

1. User submits username + platform
2. `playerStore` checks localStorage cache (`useApiCache`, 15-min TTL, stale-while-revalidate)
3. `fetchPlayerStats()` in `api.js` calls the bridge endpoint via Vite's dev proxy (`/api/bridge` → `api.mozambiquehe.re/bridge`)
4. `transformApiData()` in `stores/player.js` reshapes the response into `{ name, avatar, rankIcon, stats, legends }`
5. Result cached to localStorage and rendered
