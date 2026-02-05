# Architecture: Apex Tracker

**Analyzed:** 2026-02-04

## Pattern

**Architecture Type:** Single Page Application (SPA)
**Pattern:** Component-based with parent state management
**Data Flow:** Unidirectional (top-down via props)

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  StatCard   │  │   FavCard   │  │UserInfoBlock│          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ props
┌─────────────────────────────────────────────────────────────┐
│                     Container Layer                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                      App.js                          │    │
│  │  - State management (useState)                      │    │
│  │  - Data fetching (fetch)                            │    │
│  │  - Data transformation                             │    │
│  │  - Event handlers                                   │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       External APIs                          │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │ Tracker.gg   │◄────────│   Heroku     │                 │
│  │    API       │  Proxy  │   Proxy      │                 │
│  └──────────────┘         └──────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

| Component | Location | Responsibility |
|-----------|----------|-----------------|
| App.js | `src/App.js` | Main container, state, data fetching |
| Background | `src/components/Background.js` | Dynamic background based on legend |
| InputContainer | `src/components/InputContainer.js` | Search input wrapper |
| Input | `src/components/Input.js` | Username input + platform selection |
| SearchButton | `src/components/SearchButton.js` | Triggers search |
| UserInfoBlock | `src/components/UserInfoBlock.js` | Displays player name, rank, avatar |
| StatCard | `src/components/StatCard.js` | Individual stat display |
| FavCard | `src/components/FavCard.js` | Favorite legend card |
| AnimateAll | `src/components/AnimateAll.js` | Animation wrapper |
| Error | `src/components/Error.js` | Error message display |

## Data Flow

1. **User Input** → Input component captures username + platform
2. **API Call** → `getData()` fetches from Tracker.gg via proxy
3. **Data Transformation** → Response sorted/filtered for stats and favorites
4. **State Update** → React state updated with new data
5. **Re-render** → Components receive new props and animate in

## State Management

**Location:** All state in `App.js` (useState hooks)

**Key State Variables:**
- `loading` - API fetch status
- `platformCode` - Selected platform (1=XBOX, 2=PSN, 5=PC)
- `data` - Raw API response
- `playerStats` - Processed overview stats
- `favStats` - Top 2 legends by kills
- `legendStats` - User info (name, avatar, rank icon)
- `error` - Error state (0=none, 1=error)
- `animate` - Controls animation re-render

## Animation Strategy

- **react-spring** - Physics-based animations for entry effects
- **AnimateAll** wrapper - Opacity transition for batch re-renders
- **Conditional animation** - Uses `animateCount` to toggle animation on/off between searches

## Entry Points

| Entry | Location | Purpose |
|-------|----------|---------|
| `src/index.js` | Application bootstrap | Renders App to DOM |
| `src/App.js` | Root component | Main application logic |
| `public/index.html` | HTML template | Root div container |

## Build Order Dependencies

1. Bootstrap CSS must load before app (`src/index.js:6`)
2. `utils.js` exports used by `App.js` (icons, backgrounds, helpers)
3. All components must be imported before JSX rendering
