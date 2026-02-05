---
phase: 03-seo-sharing
plan: 02
subsystem: seo
tags: [@vueuse/core, meta-tags, vue-router, seo]

# Dependency graph
requires:
  - phase: 03-01
    provides: Vue Router setup with route definitions
provides:
  - Dynamic page title management via usePageTitle composable
  - SEO meta tags (description, robots) in index.html
  - Reactive title updates based on route and player data
affects: [03-05-meta-tags, 03-06-social-sharing]

# Tech tracking
tech-stack:
  added: ["@vueuse/core (useTitle)"]
  patterns:
    - "Centralized title management via composable"
    - "Reactive title updates on route/player data changes"
    - "SEO-first title format with player name first"

key-files:
  created: [src/composables/usePageTitle.js]
  modified: [src/main.js, index.html]

key-decisions:
  - "Use VueUse useTitle() instead of document.title for reactivity"
  - "Player name first in title format for SEO ('{PlayerName} - Apex Legends Stats')"
  - "Watch playerStore.data.name to update title after API fetch completes"

patterns-established:
  - "Composable pattern: usePageTitle() called once in main.js at app level"
  - "Dual watch strategy: route.name for navigation, playerStore.data.name for API updates"
  - "Fallback strategy: API data prioritized over URL params for accuracy"

# Metrics
duration: ~5min
completed: 2026-02-05
---

# Phase 3 Plan 2: Dynamic Page Titles Summary

**Dynamic page title management using VueUse useTitle() composable with reactive updates based on route and player API data**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-02-05T14:30:00Z (estimated)
- **Completed:** 2026-02-05T14:35:00Z (estimated)
- **Tasks:** 4
- **Files modified:** 3

## Accomplishments

- Created `usePageTitle` composable for centralized title management
- Registered title management in main.js for app-wide reactivity
- Added SEO meta tags (description, robots) to index.html
- Implemented dual-watch strategy for route-based and data-based title updates

## Task Commits

Each task was committed atomically:

1. **Task 1: Create usePageTitle composable** - `55a0998` (feat)
2. **Task 2: Register usePageTitle in main.js** - `1b52f5a` (feat)
3. **Task 3: Add SEO meta tags to index.html** - `2ae5f79` (feat)
4. **Task 4: Update player title with fetched data** - `da46298` (feat)

**Plan metadata:** TBD (docs: complete plan)

## Files Created/Modified

- `src/composables/usePageTitle.js` - Centralized title management composable using VueUse useTitle()
- `src/main.js` - Registered usePageTitle() at app level for route watching
- `index.html` - Added meta description and robots tags for SEO

## Decisions Made

- Used VueUse's `useTitle()` instead of direct `document.title` manipulation for proper Vue reactivity
- Player name appears first in title format ("{PlayerName} - Apex Legends Stats") for better SEO
- Composable called once in main.js rather than per-component to avoid duplicate watchers
- Dual-watch strategy: route.name for navigation changes, playerStore.data.name for API completion

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed without issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Title management foundation complete, ready for dynamic meta tag updates in 03-05
- Pattern established for reactive meta updates based on route/player data
- No blockers or concerns

---
*Phase: 03-seo-sharing*
*Completed: 2026-02-05*
