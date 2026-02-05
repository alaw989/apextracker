# Conventions: Apex Tracker

**Analyzed:** 2026-02-04

## Code Style

**Imports:** Grouped and ordered
1. React imports first
2. Third-party libraries
3. Relative imports (components, utils, assets)

Example from `src/App.js`:
```javascript
import React, { useState, useEffect } from "react";
import "./App.css";
import Background from "./components/Background";
import Error from "./components/Error";
// ... more components
import { backgrounds, compare, icons, bgSwitch } from "./utils.js";
```

## Component Patterns

**Styled Components:** Used for all component styling
- Component name + "Wrapper" suffix for styled containers
- Props passed to styled components for dynamic values

Example from `src/components/StatCard.js`:
```javascript
const StatCardWrapper = styled.div`
  .statcard {
    background-color: #24283c;
    // ...
  }
`;
```

**Functional Components:** All components are functional (no classes)
- Hooks for state (`useState`)
- Destructured props in function signature
- Default exports

**React Spring:** Used for animations
- `useSpring` hook for physics-based animations
- `animated.div` for animated elements

## Naming Patterns

**Components:** PascalCase
- `StatCard`, `FavCard`, `UserInfoBlock`

**Props:** camelCase
- `bgData`, `toggleDisplay`, `rerenderAnimate`, `stat`

**State Variables:** camelCase
- `iconIndex`, `platformCode`, `playerStats`, `favStats`, `legendStats`

**Constants:** UPPER_SNAKE_CASE or camelCase
- `myHeaders` (Headers object)

**Event Handlers:** camelCase with descriptive names
- `captureValue`, `captureValue2`, `darkenBackground`, `lightenBackground`, `selectIcon`

## Error Handling

**Try-Catch:** Used in fetch operations
```javascript
.catch(function() {
  console.log("error");
  setError("1");
  setLoading(false);
});
```

**Error State:** String-based ("0" = no error, "1" = error)

**Error Display:** Conditional rendering based on error state

## CSS Patterns

**Styled Components:** Primary styling method
- Uses template literals
- Media queries from mixins
- Nested selectors for child elements

**CSS-in-JS:**
- Props control dynamic values (`${props => props.bgData}`)
- Responsive breakpoints via `mq` from `_mixins.js`

**Bootstrap Grid:** Used for layout
- `col-12`, `col-md-4`, `col-lg-6` etc.
- `row` wrapper for grid rows
- `container` for content centering

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Dark background | `#24283c` | Stat cards |
| Border | `#424761` | Card borders |
| Red overlay | `rgba(226,59,46, 100%)` | Focus state |
| Dimmed red | `rgba(170, 47, 43, 80%)` | Default state |
| Icons | `#CAD0E3` | Platform icons |
| Text | White (`#fff`) |

## Code Organization

**Single Responsibility:** Each component is a separate file
- Platform icons split into separate files (XboxSVG.js, PlaystationSVG.js)
- Reusable components (StatCard, FavCard)

**Utility Functions:** Centralized in `utils.js`
- `compare` - Sort comparison function
- `bgSwitch` - Background selector based on legend name
- `backgrounds` - Image imports object
- `icons` - Platform icon SVG array
- `svgs` - Named SVG exports

## Comments

**Minimal:** Very few inline comments
- Console.log statements for debugging
- Commented-out code for alternative implementations
- No JSDoc or function documentation

## Anti-Patterns Observed

1. **Hardcoded API key** in source (`src/App.js:20`)
2. **Global window access** (`window.input_search.value`)
3. **Magic numbers** for platform codes (1, 2, 5)
4. **Nested ternary operators** in `selectIcon` function
5. **Console.log left in production code**
