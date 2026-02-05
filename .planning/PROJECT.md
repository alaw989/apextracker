# Apex Tracker

## What This Is

An Apex Legends player stats tracker that helps players look up their rankings, kill counts, and performance data. Players search by username and platform to see their current stats and favorite legends. The product will evolve from a simple stat lookup into a feature-rich platform with user accounts, history tracking, and legend guides - monetized through ads and affiliate links.

## Core Value

Fast, accurate stat lookup that gives Apex players immediate insight into their performance and keeps them coming back to track their progress.

## Requirements

### Validated

- ✓ Player stat lookup via username and platform selection — existing
- ✓ Display of player rank, avatar, and overview stats — existing
- ✓ Top 2 legends by kills display — existing
- ✓ Dynamic background based on favorite legend — existing
- ✓ React SPA with animation support — existing

### Active

- [ ] Vue SPA rewrite — migrate from React to Vue for simpler mental model
- [ ] Modernized tech stack — current dependencies are from 2019
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

**Existing Codebase:**
- React 16.11 SPA with Create React App 3.2 (from 2019)
- Bootstrap 4.3.1 for styling, react-spring for animations
- Fetches data from Tracker.gg API via Heroku proxy
- Component-based architecture with parent state management in App.js
- All state is local (no database, no user accounts)

**Technical Debt:**
- Outdated dependencies with security vulnerabilities
- No TypeScript (pure JavaScript)
- No backend infrastructure (static frontend only)
- No data persistence (every lookup is fresh API call)

**User Motivation:**
- Current app lacks features for a viable product
- Want to build something with monetization potential
- Vue preferred over React for simpler mental model
- Progressive rollout approach — ship in phases

## Constraints

- **API**: Tracker.gg API — may have rate limits or change terms
- **Platform**: Web-only, must be mobile-responsive
- **Monetization**: Ads and affiliates only (no subscription model planned)
- **Progressive**: Ship in phases, each delivering value

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vue SPA rewrite | Simpler mental model than React hooks | — Pending |
| Progressive rollout | Minimize risk, each phase adds value | — Pending |
| Ads/affiliate model | No need for payment infrastructure initially | — Pending |

---
*Last updated: 2026-02-04 after initialization*
