---
phase: 02-visual-polish
plan: 02
subsystem: ui
tags: vue, transition, animation, css

# Dependency graph
requires:
  - phase: 01-core-lookup
    provides: stat and legend display components
provides:
  - Shared transition CSS classes for card animations (fade + slide up)
  - Transition wrapper for StatsList with animation replay on data change
  - TransitionGroup wrapper for FavoriteLegends with staggered delays
  - Transition wrapper for PlayerHeader with synchronized animation timing
affects: []

# Tech tracking
tech-stack:
  added:
  - Vue Transition/TransitionGroup components (built-in)
  patterns:
  - animKey ref pattern for forcing re-render/replay of transitions
  - GPU-accelerated animations using only transform and opacity
  - Staggered animation delays using CSS nth-child selectors

key-files:
  created:
  - src/style/transitions.css
  modified:
  - src/components/stats/StatsList.vue
  - src/components/legends/FavoriteLegends.vue
  - src/components/stats/PlayerHeader.vue

key-decisions:
  - "Using appear prop to animate on first render (not just subsequent updates)"
  - "animKey ref pattern forces Vue to remount components, replaying animations on new search"
  - "TransitionGroup for legends enables staggered delays via nth-child CSS"
  - "0.4s cubic-bezier(0.16, 1, 0.3, 1) for snappy, Apple-like feel"
  - "100ms stagger between legend cards for visual hierarchy"

patterns-established:
  - "Pattern: Transition appear animation - name prop matches CSS class prefix, appear prop triggers on mount"
  - "Pattern: Animation replay - animKey ref increments on data change, :key binding forces remount"
  - "Pattern: GPU-only animations - only transform and opacity, no layout properties"

# Metrics
duration: <1min
completed: 2026-02-05
---

# Phase 2 Plan 2: Stat Card Animation System Summary

**Vue Transition components with staggered legend card animations using transform-only CSS for GPU acceleration**

## Performance

- **Duration:** <1 min (already completed)
- **Started:** 2026-02-05T15:54:10Z
- **Completed:** 2026-02-05T15:54:53Z
- **Tasks:** 4/4
- **Files modified:** 4

## Accomplishments

- Created shared `transitions.css` with GPU-accelerated animation classes
- Added fade/slide-up animations to StatsList component
- Added staggered animations to FavoriteLegends (100ms delay between cards)
- Synchronized PlayerHeader animation with other stat components
- Implemented animKey pattern for replaying animations on each new search

## Task Commits

Each task was committed atomically:

1. **Task 1: Create shared transitions CSS file** - `04751fc` (feat)
2. **Task 2: Add Transition to StatsList component** - `e70b5be` (feat)
3. **Task 3: Add TransitionGroup to FavoriteLegends component** - `b569312` (feat)
4. **Task 4: Add transition animation to PlayerHeader** - `ba8761d` (feat)

**Plan metadata:** Pending

## Files Created/Modified

- `src/style/transitions.css` - Shared transition classes (.card-appear-enter-active, .stagger-enter-active)
- `src/components/stats/StatsList.vue` - Added Transition wrapper with animKey replay pattern
- `src/components/legends/FavoriteLegends.vue` - Added TransitionGroup with stagger delays
- `src/components/stats/PlayerHeader.vue` - Added Transition wrapper for synchronized animation

## Decisions Made

- **Easing function:** `cubic-bezier(0.16, 1, 0.3, 1)` provides snappy, Apple-like feel (overshoots slightly then settles)
- **Animation duration:** 400ms total, fast enough to not feel sluggish but visible enough to perceive
- **Stagger delays:** 100ms between legend cards creates clear visual hierarchy
- **Transform-only:** Only animating transform and opacity for GPU acceleration (no layout thrashing)
- **CSS import strategy:** Import transitions.css only in components that use it, not in base.css

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All stat display components now have smooth entry animations
- Animation replay pattern established for future components
- Ready for Phase 3: SEO & Sharing

---
*Phase: 02-visual-polish*
*Completed: 2026-02-05*
