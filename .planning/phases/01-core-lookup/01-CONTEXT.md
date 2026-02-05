# Phase 1: Core Lookup - Context

**Gathered:** 2026-02-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Vue SPA stat lookup — players search by username/platform, see their rank, avatar, overview stats, and top 2 legends by kills. This phase delivers the core search and display functionality. Dynamic backgrounds and animations are Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Component Architecture
- **Vue 3 Composition API** with `<script setup>` syntax
- **Fine-grained components** — many small, focused components (SearchInput, PlatformSelect, SearchButton, StatCard, LegendCard, etc.)
- **Feature-based organization** — components organized by feature (components/search/, components/stats/, components/legends/)
- **Design system folder** — shared UI elements in components/ui/ for reuse (BaseButton, BaseInput, BaseCard)

### API Integration
- **Pinia store for API calls** — all fetch logic goes through Pinia store actions
- **Proxy migration** — moving from Heroku to DigitalOcean hosted proxy
- **Data transformation in store** — store actions parse raw API data into app-friendly format before state update
- **Claude's discretion** — error handling approach (store state, throw/catch, or hybrid)

### State Management
- **Mostly global state** — player data, loading, errors in Pinia; minimal local component state
- **Multiple stores** — separate stores: usePlayerStore, useSearchStore, useUiStore
- **Per-operation loading** — separate loading states for each async operation
- **Search history persisted** — store recent searches for quick re-access (localStorage)

### UI Layout
- **Centered hero layout** — search prominent at top, stats appear below in centered container
- **List view for stats** — stats displayed as clean list with labels and values (not cards or grid)
- **Inline search controls** — input and platform selector in same row with search button
- **Claude's discretion** — legend card display arrangement (horizontal vs stacked)

</decisions>

<specifics>
## Specific Ideas

- Moving proxy from Heroku to DigitalOcean hosting
- Want search history for quick re-access to previously viewed players
- Preference for fine-grained, composable components over monolithic ones

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

---

*Phase: 01-core-lookup*
*Context gathered: 2026-02-04*
