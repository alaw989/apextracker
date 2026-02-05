# Roadmap: Apex Tracker

## Overview

Vue SPA rewrite of the existing React stat lookup application. The roadmap progresses from core functionality (search, display stats) through visual polish (dynamic backgrounds, animations), to SEO enablement (shareable URLs, meta tags), and finally performance optimization (caching, asset optimization). Each phase delivers a verifiable increment of value.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Core Lookup** - Vue stat lookup with search and display ✓
- [ ] **Phase 2: Visual Polish** - Dynamic backgrounds and smooth animations
- [ ] **Phase 3: SEO & Sharing** - Shareable URLs and discoverability
- [ ] **Phase 4: Performance** - Caching and asset optimization

## Phase Details

### Phase 1: Core Lookup

**Goal**: Players can search for Apex Legends stats and see their rank, avatar, kills, and favorite legends in a Vue SPA.

**Depends on**: Nothing (first phase)

**Requirements**: CORE-01, CORE-02, CORE-03, CORE-04, CORE-06, UX-04

**Success Criteria** (what must be TRUE):
1. User can enter a username, select a platform (Xbox/PSN/PC), and search for their stats
2. User sees their player rank icon, avatar, and overview stats (kills, wins, etc.)
3. User sees their top 2 legends by kills with the favorite legend visually highlighted
4. User sees a helpful error message when the player is not found (invalid username or no data)
5. User sees a loading indicator while data is being fetched

**Plans**: 6 plans in 3 waves

Plans:
- [ ] 01-01-PLAN.md — Initialize Vue 3 + Vite project with Pinia state management and design system foundation
- [ ] 01-02-PLAN.md — Create utility functions, constants, and assets needed for API integration and platform selection
- [ ] 01-03-PLAN.md — Build the search interface with username input, platform selector, and search button
- [ ] 01-04-PLAN.md — Implement API integration with Tracker.gg to fetch player stats via Heroku proxy
- [ ] 01-05-PLAN.md — Create player stats display components: player header, overview stats list, and favorite legends
- [ ] 01-06-PLAN.md — Add loading and error states for the search and display flow

### Phase 2: Visual Polish

**Goal**: The app feels polished with dynamic backgrounds that react to the player's favorite legend and smooth stat card animations.

**Depends on**: Phase 1

**Requirements**: CORE-05, UX-03

**Success Criteria** (what must be TRUE):
1. Background changes dynamically based on the player's favorite legend (each legend has unique themed background)
2. Stat cards animate smoothly when appearing (fade/slide transitions)
3. Animations replay cleanly when searching for a new player

**Plans**: 2 plans in 1 wave

Plans:
- [ ] 02-01-PLAN.md — Dynamic background system tied to favorite legend with Vue Transition crossfade
- [ ] 02-02-PLAN.md — Stat card transition animations using Vue Transition and TransitionGroup components

### Phase 3: SEO & Sharing

**Goal**: Players can share their stats via URL and the app is discoverable through search engines and social media.

**Depends on**: Phase 2

**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, UX-01

**Success Criteria** (what must be TRUE):
1. User can share their stats via a URL containing username and platform (e.g., /player/username/pc)
2. When a profile URL is shared on social media, a preview card appears with the player's name and rank
3. Page structure uses semantic HTML (header, main, nav) for search crawlers
4. Page has descriptive title and meta description for each profile view
5. App displays correctly on mobile devices (responsive layout)

**Plans**: TBD

Plans:
- [ ] 03-01: Vue Router integration with shareable profile URLs
- [ ] 03-02: Dynamic meta tags (OG tags) for social sharing
- [ ] 03-03: Semantic HTML structure and meta descriptions
- [ ] 03-04: Mobile responsive styling and layout adjustments

### Phase 4: Performance

**Goal**: The app loads quickly and makes efficient use of the Tracker.gg API to avoid rate limits.

**Depends on**: Phase 3

**Requirements**: PERF-01, PERF-02, PERF-03, UX-02

**Success Criteria** (what must be TRUE):
1. Repeated searches for the same player use cached data (no redundant API calls)
2. Page loads in under 2 seconds on a typical connection
3. Images (rank icons, avatars, legend art) are lazy-loaded
4. Production build assets are minified and compressed

**Plans**: TBD

Plans:
- [ ] 04-01: API response caching (localStorage or in-memory cache)
- [ ] 04-02: Lazy loading for images
- [ ] 04-03: Build optimization (minification, compression, bundle analysis)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Core Lookup | 6/6 | Complete | 2026-02-04 |
| 2. Visual Polish | 0/2 | Ready | - |
| 3. SEO & Sharing | 0/4 | Not started | - |
| 4. Performance | 0/3 | Not started | - |

**Overall Progress:** 6/15 plans complete (40%)
