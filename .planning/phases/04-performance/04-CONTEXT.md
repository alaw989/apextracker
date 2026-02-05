# Phase 4: Performance - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

## Phase Boundary

Performance optimizations for the existing stat lookup app: API response caching to avoid redundant calls and respect rate limits, lazy loading for images to improve initial load time, and build optimizations to minimize bundle size and load time. No new features — making what exists faster and more efficient.

## Implementation Decisions

### Cache strategy
- **Stale-while-revalidate pattern** — Show cached data immediately, fetch fresh in background
- **15 minute freshness window** — Data considered fresh for 15 minutes, then stale
- **Show cache timestamp** — Display "Updated X min ago" so users know data age
- **Manual refresh button** — Small icon, always available, lets users force fresh data

### Lazy loading UX
- **Fade-in animation** — Images fade in smoothly when loaded (not instant)
- **Solid color placeholder** — Gray box while image is loading
- **Match existing animation style** — Consistent with current card transitions for smooth feel
- **Viewport images load immediately** — Images in initial viewport don't wait for IntersectionObserver
- **All images use same behavior** — Avatars, rank icons, legend art all consistent
- **All images lazy load** — Even small icons, though viewport images trigger immediately
- **Failed image fallback** — Use placeholder image if load fails

### Build priorities
- **Primary metric: Load time** — Minimize time to interactive above all else
- **Set bundle size budgets** — Enforce limits to prevent bloat
- **Minimize dependencies** — Aggressively tree-shake, avoid large libraries
- **Use code splitting** — Route-based chunks for faster initial load

### Cache persistence
- **localStorage** — Cache survives browser close, available on return visits
- **No manual cache clearing** — Cache manages itself automatically
- **No user-facing cache controls** — Users don't need to think about it

### Claude's Discretion
- **localStorage full handling** — Choose best approach (QuotaExceededError handling, graceful fallback)
- **Cache eviction strategy** — LRU, time-based, or size-based limits
- **Exact bundle budget numbers** — Set reasonable limits based on typical Vue app sizes
- **IntersectionObserver margin** — Whether to load images slightly before entering viewport

## Specific Ideas

- Stale-while-revalidate lets users see their stats immediately even if data is slightly old
- Match existing animation timing and easing from Phase 2 for consistency
- Small refresh icon — not prominent, always available for power users

## Deferred Ideas

None — discussion stayed within phase scope

---

*Phase: 04-performance*
*Context gathered: 2026-02-05*
