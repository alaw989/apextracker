# Phase 1: Core Lookup - Research

**Researched:** 2026-02-04
**Domain:** Vue 3 SPA with Pinia state management, Tracker.gg API integration
**Confidence:** HIGH

## Summary

This phase involves building a Vue 3 Single Page Application for Apex Legends player stat lookup. The core functionality includes player search by username/platform, displaying rank/avatar/overview stats, and showing top 2 legends by kills. This is a rewrite from React to Vue 3, migrating from styled-components to plain CSS/SCSS with component-scoped styles.

The standard Vue 3 ecosystem has stabilized around Composition API with `<script setup>`, Pinia for state management (Vuex is deprecated), and Vite as the build tool. The current stable versions are Vue 3.5.27, Pinia 2.3.1, VueUse 11.3.0, and Vite 7.3.1.

**Primary recommendation:** Use Vue 3.5 with Composition API and `<script setup>`, Pinia setup stores for state management, and Vite for the development server. Use VueUse's `useLocalStorage` composable for search history persistence. Implement per-operation loading states in Pinia stores for clean error handling.

## Standard Stack

The established libraries/tools for Vue 3 SPA development in 2026:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vue | 3.5.27 | Progressive JavaScript framework | Current stable, Composition API is mature, `<script setup>` is recommended |
| Vite | 7.3.1 | Build tool and dev server | Official Vue build tool, fastest HMR, industry standard |
| Pinia | 2.3.1 | State management | Official Vue store, replaced Vuex, excellent TypeScript support |
| @vueuse/core | 11.3.0 | Composition utilities | Essential composables including `useLocalStorage` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vue-router | 4.x | Client-side routing | If adding navigation later (not needed for Phase 1) |
| TypeScript | 5.x | Type safety | Optional but recommended for larger projects |
| Vitest | 2.x | Unit testing | For testing Pinia stores and composables |

### API Integration
| Tool | Purpose | Notes |
|------|---------|-------|
| fetch API | HTTP requests | Built-in, no additional library needed |
| Tracker.gg API v2 | Apex Legends stats | Proxy required (CORS), 30 req/60 sec rate limit |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| VueUse `useLocalStorage` | Custom localStorage composable | VueUse is battle-tested with SSR support |
| Pinia Setup Stores | Pinia Option Stores | Setup stores more flexible with Composition API |
| Vite | Vue CLI / webpack | Vite is faster, official recommendation for new projects |

**Installation:**
```bash
# Using Vite (recommended)
npm create vite@latest apextracker -- --template vue
cd apextracker
npm install

# Add Pinia and VueUse
npm install pinia @vueuse/core

# For TypeScript (optional)
npm install -D typescript @vue/tsconfig
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── assets/           # Static assets (images, fonts)
├── components/       # Feature-based components
│   ├── search/       # SearchInput, PlatformSelect, SearchButton
│   ├── stats/        # StatCard, StatsList
│   ├── legends/      # LegendCard, FavoriteLegends
│   └── ui/           # BaseButton, BaseInput, BaseCard (design system)
├── composables/      # Reusable composition functions
├── stores/           # Pinia stores
│   ├── player.ts     # usePlayerStore (API calls, player data)
│   ├── search.ts     # useSearchStore (search history)
│   └── ui.ts         # useUiStore (loading, error states)
├── types/            # TypeScript interfaces (if using TS)
├── utils/            # Helper functions
├── App.vue           # Root component
└── main.ts           # Entry point
```

### Pattern 1: Pinia Setup Store with Async Actions
**What:** Define stores using Composition API-style setup function for maximum flexibility
**When to use:** All new Pinia stores in Vue 3 projects
**Example:**
```typescript
// Source: https://pinia.vuejs.org/core-concepts/
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  // State
  const player = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const hasError = computed(() => error.value !== null)

  // Actions
  async function fetchPlayer(username: string, platform: string) {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(
        `${PROXY_URL}/https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${username}`,
        {
          headers: { 'TRN-Api-Key': API_KEY }
        }
      )

      if (!response.ok) {
        throw new Error('Player not found')
      }

      const data = await response.json()
      player.value = transformPlayerData(data)
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return { player, loading, error, hasError, fetchPlayer }
})
```

### Pattern 2: Component with `<script setup>`
**What:** Use `<script setup>` syntax for all components
**When to use:** All Vue 3 single-file components
**Example:**
```vue
<script setup lang="ts">
// Source: https://vuejs.org/guide/scaling-up/sfc
import { ref } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
// Use storeToRefs to maintain reactivity when destructuring
const { player, loading, error } = storeToRefs(playerStore)
const { fetchPlayer } = playerStore // Actions can be destructured directly

const searchForm = ref({
  username: '',
  platform: 'origin' // origin, xbl, psn
})

async function handleSearch() {
  await fetchPlayer(searchForm.value.username, searchForm.value.platform)
}
</script>

<template>
  <div>
    <!-- Search UI -->
    <input v-model="searchForm.username" placeholder="Username" />
    <select v-model="searchForm.platform">
      <option value="origin">PC</option>
      <option value="xbl">Xbox</option>
      <option value="psn">PlayStation</option>
    </select>
    <button @click="handleSearch">Search</button>

    <!-- Loading state -->
    <div v-if="loading">Loading...</div>

    <!-- Error state -->
    <div v-if="error">{{ error }}</div>

    <!-- Player data -->
    <div v-if="player">{{ player.name }}</div>
  </div>
</template>
```

### Pattern 3: Feature-Based Component Organization
**What:** Group components by feature rather than type
**When to use:** Medium to large applications
**Example:**
```
components/
├── search/           # Search-related components
│   ├── SearchInput.vue
│   ├── PlatformSelect.vue
│   └── SearchButton.vue
├── stats/            # Stats display components
│   ├── StatCard.vue
│   └── StatsList.vue
├── legends/          # Legend-related components
│   ├── LegendCard.vue
│   └── FavoriteLegends.vue
└── ui/               # Shared design system components
    ├── BaseButton.vue
    ├── BaseInput.vue
    └── BaseCard.vue
```

### Anti-Patterns to Avoid
- **Destructuring store state directly without `storeToRefs()`:** Breaks reactivity
- **Mixing Options API and Composition API:** Choose one approach per component
- **Putting API calls in components:** Always use Pinia store actions for API calls
- **Global CSS without scoping:** Use `<style scoped>` in Vue SFCs
- **Mutating props directly:** Props are read-only, emit events to parent

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| localStorage persistence | Custom localStorage wrapper | VueUse `useLocalStorage` | Handles SSR, reactive sync, type safety |
| State management | reactive() global state | Pinia stores | DevTools, TypeScript support, plugin ecosystem |
| API request state | Manual loading/error refs | Pinia store actions | Centralized error handling, testable |
| Debounced search | Custom setTimeout | VueUse `useDebounceFn` | Cleanup, edge cases handled |
| Platform detection | Navigator checks | VueUse `usePlatform` or similar | Consistent API, cross-browser |

**Key insight:** VueUse provides production-ready composables for common browser APIs. Hand-rolling localStorage sync, for example, fails to handle SSR, race conditions, and storage events from other tabs.

## Common Pitfalls

### Pitfall 1: Forgetting `.value` on Refs
**What goes wrong:** Accessing `ref.value` without `.value` returns the ref object, not the value
**Why it happens:** Refs are wrapper objects, need `.value` to access in JavaScript
**How to avoid:** Always use `.value` when accessing refs in `<script setup>`; template auto-unwraps
**Warning signs:** Template shows `[object Object]` or logs show `RefImpl` objects

### Pitfall 2: Destructuring Reactive Objects
**What goes wrong:** Destructuring `reactive()` or store objects breaks reactivity
**Why it happens:** Destructuring creates non-reactive copies of properties
**How to avoid:** Use `toRefs()` for reactive objects, `storeToRefs()` for Pinia stores
**Example:**
```typescript
// Wrong - breaks reactivity
const { player } = store

// Correct - maintains reactivity
import { storeToRefs } from 'pinia'
const { player } = storeToRefs(store)
const { fetchPlayer } = store // Actions don't need storeToRefs
```

### Pitfall 3: Missing Error Boundaries in Async Actions
**What goes wrong:** Unhandled promise rejections crash the app
**Why it happens:** Async actions without try/catch don't handle errors
**How to avoid:** Always use try/catch/finally in async store actions, return error objects
**Warning signs:** "Uncaught (in promise)" errors in console

### Pitfall 4: Platform Slug Confusion
**What goes wrong:** Using wrong platform identifier for Tracker.gg API
**Why it happens:** Multiple platform naming conventions (numeric vs slug)
**How to avoid:** Use API v2 slugs: `origin` (PC), `xbl` (Xbox), `psn` (PlayStation)
**Note:** Legacy API used numbers (1=Xbox, 2=PSN, 5=PC) but v2 uses string slugs

### Pitfall 5: CORS Issues with Tracker.gg API
**What goes wrong:** Browser blocks direct API calls to Tracker.gg
**Why it happens:** Tracker.gg API doesn't have CORS headers for browser calls
**How to avoid:** Use proxy server (existing Heroku proxy or new DigitalOcean proxy)
**Existing proxy:** `https://fathomless-mesa-94824.herokuapp.com/`

### Pitfall 6: API Rate Limiting
**What goes wrong:** 429 errors after too many requests
**Why it happens:** Tracker.gg allows 30 requests per 60 seconds
**How to avoid:** Implement debouncing on search input, cache results in store

## Code Examples

Verified patterns from official sources:

### Pinia Store with Data Transformation
```typescript
// Source: https://pinia.vuejs.org/core-concepts/
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface PlayerStats {
  subtitle: string
  stat: string
}

interface Legend {
  name: string
  imageUrl: string
  kills: string
}

interface PlayerData {
  name: string
  avatar: string
  rankIcon: string
  stats: PlayerStats[]
  legends: Legend[]
}

export const usePlayerStore = defineStore('player', () => {
  const data = ref<PlayerData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Per-operation loading state
  const searchLoading = ref(false)

  // Data transformation helper
  function transformApiData(apiResponse: any): PlayerData {
    const segments = apiResponse.data.segments

    // Transform overview stats
    const stats: PlayerStats[] = []
    for (const prop in segments[0].stats) {
      const stat = segments[0].stats[prop]
      if (typeof stat === 'object' && stat.displayName) {
        stats.push({
          subtitle: stat.displayName,
          stat: stat.displayValue || stat.value
        })
      }
    }

    // Filter and sort legends by kills
    const legendSegments = segments
      .filter((s: any) => s.type !== 'overview' && s.stats.kills)
      .sort((a: any, b: any) => b.stats.kills.value - a.stats.kills.value)
      .slice(0, 2)

    const legends: Legend[] = legendSegments.map((seg: any) => ({
      name: seg.metadata.name,
      imageUrl: seg.metadata.imageUrl,
      kills: seg.stats.kills.displayValue
    }))

    return {
      name: apiResponse.data.platformInfo.platformUserHandle,
      avatar: apiResponse.data.platformInfo.avatarUrl,
      rankIcon: segments[0].stats.rankScore.metadata.iconUrl,
      stats,
      legends
    }
  }

  async function searchPlayer(username: string, platform: string) {
    searchLoading.value = true
    error.value = null

    try {
      const response = await fetch(
        `${PROXY_URL}https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${username}`,
        {
          headers: { 'TRN-Api-Key': API_KEY }
        }
      )

      if (!response.ok) {
        throw new Error('Player not found. Please check the username and platform.')
      }

      const result = await response.json()
      data.value = transformApiData(result)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch player data'
      data.value = null
    } finally {
      searchLoading.value = false
    }
  }

  return {
    data,
    loading,
    searchLoading,
    error,
    searchPlayer
  }
})
```

### Search History with VueUse
```typescript
// Source: https://vueuse.org/core/uselocalstorage/
import { useLocalStorage } from '@vueuse/core'
import { ref, watch } from 'vue'

interface SearchHistoryItem {
  username: string
  platform: string
  timestamp: number
}

export function useSearchHistory() {
  // Reactive localStorage with VueUse
  const history = useLocalStorage<SearchHistoryItem[]>('apex-search-history', [])

  // Max items to keep
  const MAX_HISTORY = 10

  function addToHistory(username: string, platform: string) {
    const item: SearchHistoryItem = {
      username,
      platform,
      timestamp: Date.now()
    }

    // Remove duplicates
    const filtered = history.value.filter(
      h => h.username !== username || h.platform !== platform
    )

    // Add new item to front, limit to MAX_HISTORY
    history.value = [item, ...filtered].slice(0, MAX_HISTORY)
  }

  function clearHistory() {
    history.value = []
  }

  return {
    history,
    addToHistory,
    clearHistory
  }
}
```

### Platform Select Component
```vue
<script setup lang="ts">
// Source: Vue 3 Composition API + Pinia pattern
import { computed } from 'vue'

interface Platform {
  id: string
  name: string
  icon: string
}

const platforms: Platform[] = [
  { id: 'origin', name: 'PC', icon: 'pc-icon' },
  { id: 'xbl', name: 'Xbox', icon: 'xbox-icon' },
  { id: 'psn', name: 'PlayStation', icon: 'psn-icon' }
]

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedPlatform = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="platform-select">
    <button
      v-for="platform in platforms"
      :key="platform.id"
      :class="['platform-button', { active: selectedPlatform === platform.id }]"
      @click="selectedPlatform = platform.id"
    >
      <!-- Platform icon component would go here -->
      <span>{{ platform.name }}</span>
    </button>
  </div>
</template>

<style scoped>
.platform-select {
  display: flex;
  gap: 0.5rem;
}

.platform-button {
  padding: 0.5rem 1rem;
  border: 1px solid #424761;
  background: #24283c;
  color: #cad0e3;
  cursor: pointer;
  transition: all 0.2s;
}

.platform-button:hover {
  background: #2d334a;
}

.platform-button.active {
  background: #3c8772;
  border-color: #3c8772;
}
</style>
```

### Loading Spinner Component
```vue
<script setup lang="ts">
// Simple CSS-only loading spinner
defineProps<{
  size?: 'small' | 'medium' | 'large'
}>()
</script>

<template>
  <div class="spinner" :class="size || 'medium'">
    <div class="spinner-circle"></div>
  </div>
</template>

<style scoped>
.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner.small .spinner-circle {
  width: 16px;
  height: 16px;
}

.spinner.medium .spinner-circle {
  width: 32px;
  height: 32px;
}

.spinner.large .spinner-circle {
  width: 48px;
  height: 48px;
}

.spinner-circle {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #3c8772;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Options API | Composition API + `<script setup>` | Vue 3.2+ | Better type inference, code organization, tree-shaking |
| Vuex | Pinia | Vue 3+ | No mutations, simpler API, better TS support |
| Vue CLI / webpack | Vite | Vue 3+ | Faster dev server, optimized build, native ESM |
| Manual state sync | VueUse composables | 2020+ | SSR-safe utilities, community-tested |
| styled-components | Scoped CSS in SFC | Vue 3 standard | No runtime overhead, better perf, Vue-native |

**Deprecated/outdated:**
- **Vue 2:** EOL December 31, 2023
- **Vuex:** Replaced by Pinia as official state management
- **Vue CLI:** Replaced by Vite for new projects
- **Options API:** Still supported but Composition API is recommended for new code
- **Class API:** No longer recommended, Composition API provides better TS support

**Upcoming (2026):**
- **Vue 3.6:** Currently in beta (as of Feb 2026), includes Vapor Mode for performance
- **Vapor Mode:** New compilation mode for significant performance improvements

## Open Questions

Things that couldn't be fully resolved:

1. **Error handling approach in Pinia stores**
   - What we know: Both store-based error state and throw/catch patterns are valid
   - What's unclear: Which pattern provides better UX for this specific use case
   - Recommendation: Start with store-based error state (error ref in store), can add throw pattern later if needed. This aligns with "per-operation loading states" decision.

2. **Legend card display arrangement**
   - What we know: Need top 2 legends by kills, favorite highlighted
   - What's unclear: Horizontal vs stacked layout for legend cards
   - Recommendation: Start with stacked layout (each legend on separate row) for mobile-first design, can adjust to horizontal for larger screens with CSS grid/flexbox.

3. **Proxy URL configuration**
   - What we know: Existing Heroku proxy works, migrating to DigitalOcean
   - What's unclear: New DigitalOcean proxy URL
   - Recommendation: Store proxy URL as environment variable, can be easily changed when migration completes.

## Sources

### Primary (HIGH confidence)
- [Vue.js Official Documentation](https://vuejs.org/guide/scaling-up/sfc) - SFC structure, Composition API
- [Vue.js Composition API FAQ](https://vuejs.org/guide/extras/composition-api-faq) - Composition API patterns, reactivity
- [Pinia Core Concepts](https://pinia.vuejs.org/core-concepts/) - Store definition patterns
- [Pinia Introduction](https://pinia.vuejs.org/introduction.html) - Setup stores vs option stores
- [Tracker.gg Apex Legends API Docs](https://tracker.gg/developers/docs/titles/apex) - API endpoints, platform slugs
- [Apex Legends Site API](https://apex.tracker.gg/site-api) - Rate limits, authentication
- [VueUse useLocalStorage](https://vueuse.org/core/uselocalstorage/) - Reactive localStorage composable

### Secondary (MEDIUM confidence)
- [Vue 3 Best Practices (Medium)](https://medium.com/@ignatovich.dm/vue-3-best-practices-cb0a6e281ef4) - Community best practices
- [Best Practices for Error Handling in Vue Composables](https://alexop.dev/posts/best-practices-for-error-handling-in-vue-composables/) - Error handling patterns
- [Pinia Best Practices with TypeScript](https://seanwilson.ca/blog/pinia-vue-best-practices.html) - Store patterns
- [Vue 3 + TypeScript Best Practices 2025](https://eastondev.com/blog/en/posts/dev/20251124-vue3-typescript-best-practices/) - Enterprise patterns
- [Top 3 Composition API Pitfalls](https://escuelavue.es/en/devtips/top-3-composition-api-pitfalls) - Common mistakes

### Tertiary (LOW confidence - marked for validation)
- WebSearch results for Vue 3 loading states - May need verification with official docs
- WebSearch results for Vue 3 project structure patterns - Community consensus, not official
- WebSearch results for Pinia error handling - Multiple sources agree, but not official

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All verified with official documentation and npm registry
- Architecture: HIGH - Vue.js and Pinia official documentation confirm patterns
- Pitfalls: HIGH - Official Vue docs and established community resources
- API integration: HIGH - Official Tracker.gg documentation and existing codebase

**Research date:** 2026-02-04
**Valid until:** 2026-03-06 (30 days - Vue ecosystem is stable but minor releases continue)

---

*Phase: 01-core-lookup*
*Research completed: 2026-02-04*
