# Apex Tracker

## What This Is

An Apex Legends player stats tracker that helps players look up their rankings, kill counts, and performance data. Players search by username and platform to see their current stats and favorite legends. The product has evolved from a React app into a modern Vue 3 SPA and will continue to grow with user accounts, history tracking, and legend guides — monetized through ads and affiliate links.

## Core Value

Fast, accurate stat lookup that gives Apex players immediate insight into their performance and keeps them coming back to track their progress.

## Requirements

### Validated

- ✓ Player stat lookup via username and platform selection — v1.0
- ✓ Display of player rank, avatar, and overview stats — v1.0
- ✓ Top 2 legends by kills display — v1.0
- ✓ Dynamic background based on favorite legend — v1.0
- ✓ Vue SPA with modern build tooling — v1.0
- ✓ Shareable URLs with SEO meta tags — v1.0
- ✓ Mobile responsive design — v1.0
- ✓ API caching and lazy loading — v1.0

### Active

- [ ] User authentication — sign up, login, session management
- [ ] Profile history tracking — store and visualize stat changes over time
- [ ] User dashboard — manage multiple saved profiles
- [ ] Legend guides content — abilities, tips, loadouts for SEO and engagement
- [ ] Ad and affiliate integration — monetization infrastructure

### Out of Scope

- Mobile app — web-first, mobile-responsive site only
- Real-time stat updates — scheduled polling or manual refresh only
- Social features — no following, sharing, or community features initially
- Premium subscription model — ad/affiliate monetization only

## Context

**Current Codebase:**
- Vue 3 SPA with Vite 6 build system (shipped v1.0)
- Pinia state management with composition API pattern
- Vue Router 4 with history mode for clean URLs
- VueUse utilities (useTitle, useLocalStorage, etc.)
- Semantic HTML5 with ARIA accessibility attributes
- Mobile-first responsive design (768px breakpoint)
- Tracker.gg API integration via Heroku proxy
- localStorage-based API caching with stale-while-revalidate

**v1.0 Stats:**
- 4 phases, 19 plans completed
- 4,542 lines of Vue/JavaScript code
- Production bundle: ~55KB gzipped
- ~16 hours calendar development time

**Technical Debt:**
- CSS variable naming inconsistency (LOW) — TimestampBadge/RefreshButton use --color-* prefix instead of defined --text-*/--bg-* variables
- No backend infrastructure yet (static frontend only)
- No data persistence beyond localStorage cache

**User Motivation:**
- v1.0 MVP successfully shipped with modern Vue stack
- Foundation ready for authentication and history features
- Progressive rollout approach continues to prove effective

## Constraints

- **API**: Tracker.gg API — may have rate limits or change terms
- **Platform**: Web-only, must be mobile-responsive
- **Monetization**: Ads and affiliates only (no subscription model planned)
- **Progressive**: Ship in phases, each delivering value

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vue SPA rewrite | Simpler mental model than React hooks, modern tooling | ✓ Good — v1.0 shipped successfully |
| Progressive rollout | Minimize risk, each phase adds value | ✓ Good — all 4 phases completed smoothly |
| Vite 6 + esbuild | 20-40x faster builds than terser | ✓ Good — sub-2s build times achieved |
| Stale-while-revalidate caching | Optimal UX with API rate limit protection | ✓ Good — users see instant results |
| Manual code splitting | Vue vendor chunk for long-term caching | ✓ Good — ~55KB gzipped total transfer |
| Ads/affiliate model | No need for payment infrastructure initially | — Pending |

---
*Last updated: 2026-02-05 after v1.0 milestone*
