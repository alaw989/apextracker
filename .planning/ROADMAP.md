# Roadmap: Apex Tracker

## Overview

Vue SPA rewrite of the existing React stat lookup application. The roadmap progresses from core functionality (search, display stats) through visual polish (dynamic backgrounds, animations), to SEO enablement (shareable URLs, meta tags), and finally performance optimization (caching, asset optimization). Each phase delivers a verifiable increment of value.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Core Lookup** - Vue stat lookup with search and display
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

**Plans**: TBD

Plans:
- [ ] 01-01: Vue project setup with router and component structure
- [ ] 01-02: API integration with Tracker.gg via Heroku proxy
- [ ] 01-03: Search interface with username input and platform selector
- [ ] 01-04: Player stats display (rank, avatar, overview stats)
- [ ] 01-05: Favorite legends display (top 2 by kills)
- [ ] 01-06: Error handling and loading states

### Phase 2: Visual Polish

**Goal**: The app feels polished with dynamic backgrounds that react to the player's favorite legend and smooth stat card animations.

**Depends on**: Phase 1

**Requirements**: CORE-05, UX-03

**Success Criteria** (what must be TRUE):
1. Background changes dynamically based on the player's favorite legend (each legend has unique themed background)
2. Stat cards animate smoothly when appearing (fade/slide transitions)
3. Animations replay cleanly when searching for a new player

**Plans**: TBD

Plans:
- [ ] 02-01: Dynamic background system tied to favorite legend
- [ ] 02-02: Stat card transition animations (Vue Transition components)

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
| 1. Core Lookup | 0/6 | Not started | - |
| 2. Visual Polish | 0/2 | Not started | - |
| 3. SEO & Sharing | 0/4 | Not started | - |
| 4. Performance | 0/3 | Not started | - |

**Overall Progress:** 0/15 plans complete (0%)
