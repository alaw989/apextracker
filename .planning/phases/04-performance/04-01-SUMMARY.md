---
phase: 04-performance
plan: 01
subsystem: caching
tags: [localStorage, LRU, stale-while-revalidate, vue-composable]

# Dependency graph
requires:
  - phase: 01-core-lookup
    provides: player store, API utilities
  - phase: 03-seo-sharing
    provides: player view component structure
provides:
  - API response caching with stale-while-revalidate pattern
  - localStorage persistence for player data
  - LRU eviction policy for cache management
  - Timestamp badge showing cache age
  - Manual refresh button for forced updates
affects: [future-api-integrations, performance-monitoring]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Stale-while-revalidate caching pattern
    - LRU (Least Recently Used) eviction
    - localStorage-based persistence
    - Vue Composable for reactive caching

key-files:
  created:
    - src/utils/cache.js
    - src/composables/useApiCache.js
    - src/components/ui/TimestampBadge.vue
    - src/components/ui/RefreshButton.vue
  modified:
    - src/stores/player.js
    - src/views/PlayerView.vue

key-decisions:
  - "15-minute freshness window balances freshness with API rate limit protection"
  - "LRU eviction with MAX_CACHE_SIZE=10 prevents localStorage overflow"
  - "Stale-while-revalidate returns cached data immediately while fetching fresh in background"
  - "Manual refresh button always available for users who need fresh data"
  - "Cache timestamp visible to users so they know data age"

patterns-established:
  - "Pattern: useApiCache composable for reactive API caching"
  - "Pattern: QuotaExceededError handling with automatic LRU eviction"
  - "Pattern: Fire-and-forget background refresh for stale data"

# Metrics
duration: 4min
completed: 2026-02-05
---

# Phase 4 Plan 1: API Caching with Stale-While-Revalidate Summary

**LRU cache with localStorage persistence, 15-minute freshness window, and stale-while-revalidate pattern for instant perceived performance**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-05T20:39:05Z
- **Completed:** 2026-02-05T20:43:09Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments
- Implemented localStorage-based LRU cache with 10-entry max size
- Created useApiCache composable with stale-while-revalidate pattern
- Integrated caching into player store for automatic cache hits
- Added TimestampBadge component showing "Updated X min ago"
- Added RefreshButton component for manual cache bypass
- Cache persists across browser sessions via localStorage

## Task Commits

Each task was committed atomically:

1. **Task 1: Create localStorage cache utility with LRU eviction** - `2fddc38` (feat)
2. **Task 2: Create useApiCache composable with stale-while-revalidate** - `3f50d4f` (feat)
3. **Task 3: Integrate caching into player store and create UI components** - `ce32292` (feat)

**Plan metadata:** (pending)

## Files Created/Modified

- `src/utils/cache.js` - LRU cache wrapper with localStorage persistence, getCache/setCache/updateLRU/clearCache exports
- `src/composables/useApiCache.js` - Stale-while-revalidate logic, 15-minute TTL, timeAgo helper
- `src/components/ui/TimestampBadge.vue` - Time-ago display component with green dot indicator
- `src/components/ui/RefreshButton.vue` - Manual refresh trigger button with spinning animation
- `src/stores/player.js` - Integrated useApiCache, added cacheTimestamp/isRefreshing/cacheAge state, forceRefresh action
- `src/views/PlayerView.vue` - Added TimestampBadge and RefreshButton to player header and stats section

## Decisions Made

- **15-minute freshness window:** Balances data freshness with API rate limit protection. Users see fresh-ish data without hammering the API.
- **LRU eviction with MAX_CACHE_SIZE=10:** Prevents localStorage overflow while keeping recently-used players cached. 10 players = ~50KB estimated storage.
- **Stale-while-revalidate pattern:** Returns cached data immediately for instant perceived performance, then silently fetches fresh data in background.
- **Manual refresh always available:** Power users can force fresh fetch regardless of cache age via refresh button.
- **Visible cache timestamp:** Users see "Updated X min ago" so they understand data age and can decide if refresh is needed.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed without errors.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- API caching foundation complete, ready for additional performance optimizations
- Cache utility is reusable for other API endpoints (e.g., legends, rankings)
- LRU pattern can be extended to different cache categories if needed
- Consider adding cache size monitoring in production to track localStorage usage

---
*Phase: 04-performance*
*Completed: 2026-02-05*
