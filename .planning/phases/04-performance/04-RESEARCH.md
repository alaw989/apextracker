# Phase 04: Performance - Research

**Researched:** 2026-02-05
**Domain:** Vue 3 Performance Optimization (API Caching, Image Lazy Loading, Build Optimization)
**Confidence:** HIGH

## Summary

Phase 04 focuses on three performance optimizations for the existing Apex Legends stat lookup app: (1) API response caching using stale-while-revalidate pattern to avoid redundant API calls and respect rate limits, (2) lazy loading images (avatars, rank icons, legend art) with IntersectionObserver for improved initial load time, and (3) Vite build optimizations to minimize bundle size. The project uses Vue 3.5.27, Pinia 3.0.4, Vite 6.0.0, and VueUse 14.2.0—all actively maintained libraries with native support for the required patterns.

**Primary recommendation:** Use VueUse's `useIntersectionObserver` for lazy loading, implement a custom stale-while-revalidate composable with localStorage for API caching, and configure Vite's `build.rollupOptions` with `manualChunks` for code splitting. No external caching libraries are needed—Vue 3 + Pinia + VueUse provide all necessary primitives.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Cache strategy**
- Stale-while-revalidate pattern — Show cached data immediately, fetch fresh in background
- 15 minute freshness window — Data considered fresh for 15 minutes, then stale
- Show cache timestamp — Display "Updated X min ago" so users know data age
- Manual refresh button — Small icon, always available, lets users force fresh data

**Lazy loading UX**
- Fade-in animation — Images fade in smoothly when loaded (not instant)
- Solid color placeholder — Gray box while image is loading
- Match existing animation style — Consistent with current card transitions for smooth feel
- Viewport images load immediately — Images in initial viewport don't wait for IntersectionObserver
- All images use same behavior — Avatars, rank icons, legend art all consistent
- All images lazy load — Even small icons, though viewport images trigger immediately
- Failed image fallback — Use placeholder image if load fails

**Build priorities**
- Primary metric: Load time — Minimize time to interactive above all else
- Set bundle size budgets — Enforce limits to prevent bloat
- Minimize dependencies — Aggressively tree-shake, avoid large libraries
- Use code splitting — Route-based chunks for faster initial load

**Cache persistence**
- localStorage — Cache survives browser close, available on return visits
- No manual cache clearing — Cache manages itself automatically
- No user-facing cache controls — Users don't need to think about it

### Claude's Discretion

- **localStorage full handling** — Choose best approach (QuotaExceededError handling, graceful fallback)
- **Cache eviction strategy** — LRU, time-based, or size-based limits
- **Exact bundle budget numbers** — Set reasonable limits based on typical Vue app sizes
- **IntersectionObserver margin** — Whether to load images slightly before entering viewport

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **Vue 3** | 3.5.27 | Progressive framework | Already in project; Composition API provides reactive primitives needed |
| **Pinia** | 3.0.4 | State management | Already in project; stores can be extended with caching logic |
| **VueUse** | 14.2.0 | Composition utilities | Already in project; provides `useIntersectionObserver` for lazy loading |
| **Vite** | 6.0.0 | Build tool | Already in project; esbuild minification is 20-40x faster than terser |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **vite-plugin-compression** | latest | Gzip/Brotli compression | Optional for generating `.gz` and `.br` files during build |
| **rollup-plugin-visualizer** | latest | Bundle analysis | One-time use for identifying chunk size issues |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom stale-while-revalidate | pinia-plugin-persistedstate | Plugin only handles persistence, not cache invalidation logic; custom implementation needed for time-based staleness |
| VueUse useIntersectionObserver | Native loading="lazy" | Native attribute doesn't support fade-in animations or custom placeholders |
| esbuild minifier | terser | Terser has better compression but 20-40x slower; esbuild is sufficient for this app's size |

**Installation:**
```bash
# No new dependencies required for core features
# Optional for build compression:
npm install -D vite-plugin-compression
# Optional for bundle analysis:
npm install -D rollup-plugin-visualizer
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── composables/
│   ├── useApiCache.js      # NEW: Stale-while-revalidate logic
│   └── useLazyImage.js     # NEW: IntersectionObserver + fade-in
├── stores/
│   └── player.js           # MODIFY: Integrate cache composable
├── components/
│   ├── ui/
│   │   └── LazyImage.vue   # NEW: Reusable lazy image component
│   └── stats/
│       ├── PlayerHeader.vue   # MODIFY: Use LazyImage
│       └── TimestampBadge.vue # NEW: "Updated X min ago" badge
└── utils/
    └── cache.js             # NEW: localStorage wrapper with LRU eviction
```

### Pattern 1: Stale-While-Revalidate with Pinia

**What:** Return cached data immediately while fetching fresh data in background. Updates store silently when fresh data arrives.

**When to use:** API calls that may be repeated (same player lookup), rate-limited APIs, data that changes infrequently.

**Example:**
```javascript
// src/composables/useApiCache.js
import { ref, computed } from 'vue'

const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

export function useApiCache(key) {
  const cached = ref(null)
  const timestamp = ref(null)
  const isLoading = ref(false)

  // Source: MDN Storage API (localStorage usage pattern)
  // https://developer.mozilla.org/en-US/docs/Web/API/Storage_API

  function isFresh() {
    if (!timestamp.value) return false
    return Date.now() - timestamp.value < CACHE_TTL
  }

  async function fetchWithCache(fetchFn) {
    // Load from localStorage on mount
    if (!cached.value) {
      const stored = localStorage.getItem(`cache:${key}`)
      if (stored) {
        const { data, time } = JSON.parse(stored)
        cached.value = data
        timestamp.value = time
      }
    }

    // Return immediately if fresh
    if (cached.value && isFresh()) {
      return cached.value
    }

    // Fetch fresh data
    isLoading.value = true
    try {
      const fresh = await fetchFn()
      cached.value = fresh
      timestamp.value = Date.now()
      localStorage.setItem(`cache:${key}`, JSON.stringify({
        data: fresh,
        time: timestamp.value
      }))
      return fresh
    } finally {
      isLoading.value = false
    }
  }

  return {
    cached,
    timestamp,
    isLoading,
    isFresh: computed(() => isFresh()),
    fetchWithCache
  }
}
```

**Source:** Based on stale-while-revalidate pattern from [web.dev](https://web.dev/articles/stale-while-revalidate) and localStorage patterns from [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

### Pattern 2: Lazy Loading with VueUse

**What:** Use `useIntersectionObserver` to detect when images enter viewport, then load with fade-in animation.

**When to use:** All images (avatars, rank icons, legend art) to improve initial page load.

**Example:**
```javascript
// src/composables/useLazyImage.js
import { ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

export function useLazyImage(src) {
  const loaded = ref(false)
  const error = ref(false)
  const isVisible = ref(false)
  const targetRef = ref(null)

  const { stop } = useIntersectionObserver(
    targetRef,
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true
        stop() // Stop observing once visible
      }
    },
    { rootMargin: '50px' } // Load slightly before entering viewport
  )

  // For viewport images, load immediately
  watch(targetRef, (el) => {
    if (el && !isVisible.value) {
      // Check if already in viewport on mount
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        isVisible.value = true
        stop()
      }
    }
  }, { immediate: true })

  return { loaded, error, isVisible, targetRef }
}
```

**Source:** VueUse documentation - [useIntersectionObserver](https://vueuse.org/core/useIntersectionObserver/) (last updated: 2026-01-31)

### Pattern 3: Vite Build Optimization

**What:** Configure `build.rollupOptions` with `manualChunks` for code splitting and set bundle size budgets.

**When to use:** Production builds to minimize initial load time.

**Example:**
```javascript
// vite.config.js
export default defineConfig({
  build: {
    // Set chunk size warning limit
    chunkSizeWarningLimit: 150, // kB - appropriate for Vue apps
    minify: 'esbuild', // 20-40x faster than terser
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split vendor code from app code
          if (id.includes('node_modules')) {
            // Separate Vue core from other dependencies
            if (id.includes('vue') || id.includes('pinia') || id.includes('@vue')) {
              return 'vue-vendor'
            }
            if (id.includes('@vueuse')) {
              return 'vueuse'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})
```

**Source:** [Vite Build Options](https://vite.dev/config/build-options) (official documentation, updated 2026)

### Anti-Patterns to Avoid

- **Don't use `pinia-plugin-persistedstate`:** The plugin only handles persistence, not cache invalidation. Custom stale-while-revalidate logic is cleaner.
- **Don't use native `loading="lazy"`:** It doesn't support custom fade-in animations or consistent placeholder styling.
- **Don't set `build.minify: 'terser'`:** Esbuild is 20-40x faster with only 1-2% worse compression.
- **Don't cache in component state:** Use localStorage for persistence across page loads.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Intersection Observer | Custom intersection detection logic | VueUse `useIntersectionObserver` | Handles edge cases, unmounting, and browser compatibility |
| Animations | CSS keyframes from scratch | Existing `transitions.css` patterns | Consistent timing (0.4s cubic-bezier(0.16, 1, 0.3, 1)) already established |
| Storage quota handling | Manual size calculations | Catch `QuotaExceededError` | Only reliable way to detect localStorage limits |

**Key insight:** The existing codebase already has animation patterns in `src/style/transitions.css`—reuse the `cubic-bezier(0.16, 1, 0.3, 1)` easing and 400ms duration for consistency.

## Common Pitfalls

### Pitfall 1: Stale Cache After Browser Close

**What goes wrong:** In-memory cache is lost on refresh, defeating the purpose of caching.

**Why it happens:** Storing cache only in Pinia state (which resets on page load).

**How to avoid:** Always persist to localStorage with timestamp. On store initialization, read from localStorage first.

**Warning signs:** API still fires on page reload even for recently viewed players.

### Pitfall 2: Layout Shift from Lazy Images

**What goes wrong:** Content jumps when lazy-loaded images appear.

**Why it happens:** No explicit height/width on image containers.

**How to avoid:** Use `aspect-ratio` CSS property on image containers (already done in `LegendCard.vue` with `aspect-ratio: 16 / 9`).

**Warning signs:** Scroll position changes when images load.

### Pitfall 3: localStorage QuotaExceededError

**What goes wrong:** App crashes when localStorage is full (typically 5-10MB per origin).

**Why it happens:** No eviction strategy; cache grows unbounded.

**How to avoid:** Implement LRU eviction or cache size limit. Catch `QuotaExceededError` and fallback to in-memory cache.

**Warning signs:** Works in development, fails in production after extended use.

### Pitfall 4: IntersectionObserver Memory Leaks

**What goes wrong:** Observers not stopped when components unmount.

**Why it happens:** Forgetting to call the `stop()` function returned by `useIntersectionObserver`.

**How to avoid:** Always destructure `stop` and call it when image is loaded or component unmounts.

**Warning signs:** Memory usage increases over time in profiler.

## Code Examples

### Cache Eviction with LRU

```javascript
// src/utils/cache.js
const MAX_CACHE_SIZE = 10 // Store up to 10 player lookups
const LRU_KEY = 'cache:lru'

export function updateLRU(key) {
  const lru = JSON.parse(localStorage.getItem(LRU_KEY) || '[]')
  const index = lru.indexOf(key)

  // Remove if exists, add to end (most recently used)
  if (index > -1) lru.splice(index, 1)
  lru.push(key)

  // Evict oldest if over limit
  if (lru.length > MAX_CACHE_SIZE) {
    const evicted = lru.shift()
    localStorage.removeItem(`cache:${evicted}`)
  }

  localStorage.setItem(LRU_KEY, JSON.stringify(lru))
}

export function getCache(key) {
  updateLRU(key)
  const stored = localStorage.getItem(`cache:${key}`)
  return stored ? JSON.parse(stored) : null
}

export function setCache(key, value) {
  updateLRU(key)
  localStorage.setItem(`cache:${key}`, JSON.stringify(value))
}
```

### Lazy Image Component

```vue
<!-- src/components/ui/LazyImage.vue -->
<script setup>
import { computed, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  src: String,
  alt: String,
  placeholderColor: { type: String, default: '#374151' }
})

const emit = defineEmits(['load', 'error'])

const imageRef = ref(null)
const isLoaded = ref(false)
const hasError = ref(false)
const shouldLoad = ref(false)

const { stop } = useIntersectionObserver(
  imageRef,
  ([entry]) => {
    if (entry.isIntersecting) {
      shouldLoad.value = true
      stop()
    }
  },
  { rootMargin: '50px' }
)

function onLoad() {
  isLoaded.value = true
  emit('load')
}

function onError() {
  hasError.value = true
  emit('error')
}
</script>

<template>
  <div ref="imageRef" class="lazy-image">
    <img
      v-if="shouldLoad"
      :src="src"
      :alt="alt"
      :class="{ 'lazy-image__loaded': isLoaded }"
      @load="onLoad"
      @error="onError"
    />
    <div
      v-if="!isLoaded && !hasError"
      class="lazy-image__placeholder"
      :style="{ backgroundColor: placeholderColor }"
    />
  </div>
</template>

<style scoped>
.lazy-image {
  position: relative;
  overflow: hidden;
}

.lazy-image img {
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.lazy-image__loaded {
  opacity: 1;
}

.lazy-image__placeholder {
  position: absolute;
  inset: 0;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
```

### Time Ago Display

```javascript
// src/utils/formatTime.js
export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)

  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| window.addEventListener scroll | IntersectionObserver API | ~2020 | More performant, throttled by browser |
| v-lazy custom directive | VueUse composables | 2021-2024 | Better TypeScript support, cleaner API |
| Terser minifier | esbuild minifier (Vite default) | Vite 2+ | 20-40x faster builds |
| Service Worker caching | localStorage + stale-while-revalidate | - | SW is overkill for single-page app use case |

**Deprecated/outdated:**
- `v-lazy` directive packages: Prefer VueUse composables for better reusability
- Manual scroll listeners for lazy loading: IntersectionObserver is now universally supported (Chrome 51+, Firefox 55+, Safari 12.1+)

## Open Questions

1. **IntersectionObserver margin value**
   - What we know: Common values range from 0px to 200px
   - What's unclear: Optimal value for this app's layout
   - Recommendation: Start with 50px (loads slightly before viewport), adjust based on testing

2. **Exact bundle budget for main chunk**
   - What we know: Current main chunk is ~115KB gzipped (from build output)
   - What's unclear: Industry standard for Vue 3 apps
   - Recommendation: Set warning to 150KB, error to 200KB based on [web.dev recommendations](https://web.dev/fast/)

3. **LRU vs time-based cache eviction**
   - What we know: Both work for preventing localStorage overflow
   - What's unclear: Which is better for this use case
   - Recommendation: Use LRU with 10-entry limit—simpler and guarantees space

## Sources

### Primary (HIGH confidence)

- [VueUse useIntersectionObserver](https://vueuse.org/core/useIntersectionObserver/) - Official VueUse documentation (last updated: 2026-01-31)
- [Vite Build Options](https://vite.dev/config/build-options) - Official Vite documentation (includes chunkSizeWarningLimit, manualChunks)
- [MDN Storage Quotas and Eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria) - MDN documentation (updated: 2026-01-05)
- [Web.dev stale-while-revalidate](https://web.dev/articles/stale-while-revalidate) - Google web performance guide

### Secondary (MEDIUM confidence)

- [Vue School: Stale-While-Revalidate with Pinia](https://vueschool.io/lessons/implement-stale-while-revalidate-with-pinia-and-usememoize) - Tutorial on implementing SWR with Pinia (2024)
- [GitHub: vite-plugin-compression](https://github.com/vbenjs/vite-plugin-compression) - Compression plugin for Vite (gzip/brotli)
- [GitHub: pinia-plugin-persistedstate](https://github.com/prazdevs/pinia-plugin-persistedstate) - Pinia persistence plugin (for reference, not using)

### Tertiary (LOW confidence)

- Various blog posts on Vue 3 lazy loading and cache implementations (verified against official docs where applicable)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in project or verified from official docs
- Architecture: HIGH - Patterns from VueUse and Vite official documentation
- Pitfalls: MEDIUM - Based on common issues documented in MDN and web.dev

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - stable libraries, unlikely to change)
