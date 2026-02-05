# Phase 2: Visual Polish - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Visual enhancements to make the app feel polished — dynamic backgrounds that react to the player's favorite legend, and smooth stat card animations. The core lookup functionality already works from Phase 1; this adds the premium feel layer.

</domain>

<decisions>
## Implementation Decisions

### Background behavior
- **Default background:** Apex logo/wallpaper — shows what the app is about before search
- **Crossfade timing:** Medium crossfade (400-500ms) — noticeable but quick
- **Storage format:** Image files (JPG/PNG) in `public/backgrounds/` — simple, explicit
- **Fallback for legends without custom art:** Default gradient based on legend class (Assault, Support, Skirmisher, Controller, Recon)

### Animation style
- **Stat card entrance:** Fade + slide up — classic, polished feel
- **Legend cards:** Same as stat cards (fade + slide up) — consistent experience
- **Duration:** Claude's discretion
- **Easing:** Ease out — start fast, slow down at end (natural, physics-like)

### Animation replay
- **Old content handling:** Claude's discretion
- **Background crossfade:** Claude's discretion
- **Rapid searches:** Claude's discretion
- **Loading state:** Always show spinner on every search

### Fallback handling
- **Legend image fails:** Show default gradient for that legend's class immediately (no retry)
- **Default wallpaper fails:** Solid dark color as ultimate fallback
- **Preloading:** Claude's discretion
- **Slow background loading:** Claude's discretion

### Claude's Discretion
- Animation duration for stat cards
- Old content exit behavior when searching new player
- Whether to crossfade background when same legend
- Rapid search behavior (queue, cancel, or skip)
- Background image preloading strategy
- Slow background loading handling

</decisions>

<specifics>
## Specific Ideas

- Medium crossfade (400-500ms) for background transitions
- Ease-out easing for animations — feels like physics
- Always show loading spinner when searching (even for subsequent searches)
- Legend class-based gradients as fallback (Assault, Support, Skirmisher, Controller, Recon)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-visual-polish*
*Context gathered: 2026-02-05*
