# Phase 3: SEO & Sharing - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

<domain>
## Phase Boundary

URL routing, social media integration, and discoverability — enabling players to share their stats via URL and making the app findable by search engines. Core functionality already works from Phases 1-2; this adds distribution and discovery capabilities.

</domain>

<decisions>
## Implementation Decisions

### URL structure
- **URL format:** Claude's discretion
- **Invalid player behavior:** Fail hard — render immediate 404 if player not found
- **Case sensitivity:** Case sensitive — allow uppercase letters in URLs
- **Auto-fetch on shared URL:** Claude's discretion

### SEO metadata
- **Profile page title format:** Player name first — "{PlayerName} - Apex Legends Stats"
- **Meta description:** Claude's discretion
- **Homepage title:** "Apex Legends Stats Tracker - Lookup Player Ranks & Stats"

### Mobile behavior
- **Mobile layout:** Single column — stats become full-width, legend cards stack vertically
- **Breakpoint:** 768px (tablets use desktop layout, mobile uses stacked)
- **Touch target size:** Claude's discretion

### Claude's Discretion
- URL format choice (/player/username/pc vs alternatives)
- Auto-fetch behavior when visiting shared URL
- Meta description wording for profile views
- Touch target size for mobile buttons

</decisions>

<specifics>
## Specific Ideas

- Fail hard on invalid shared URLs (404 not found)
- Case-sensitive usernames in URLs
- Single column mobile layout at 768px breakpoint
- Player name first in page titles for SEO

</specifics>

<deferred>
## Deferred Ideas

- Social preview cards (OG images) — deferred for potential future work
- Advanced URL features (slug customization, etc.) — not in scope

</deferred>

---

*Phase: 03-seo-sharing*
*Context gathered: 2026-02-05*
