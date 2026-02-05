# Phase 3: SEO & Sharing - Research

**Researched:** 2026-02-05
**Domain:** Vue 3 + Vite routing, SEO, and social sharing
**Confidence:** HIGH

## Summary

This phase adds URL routing, social sharing capabilities, and SEO discoverability to the Apex Legends stats tracker. The core application already functions from Phases 1-2; this phase focuses on making player stats shareable via URL and improving search engine visibility.

The standard stack for Vue 3 routing is **Vue Router 4**, which provides official client-side routing with dynamic route matching, navigation guards, and 404 handling. For dynamic meta tags (Open Graph, Twitter Cards), **@vueuse/head** (now part of the **Unhead** ecosystem) is the modern solution, superseding the deprecated vue-meta library.

**Primary recommendation:** Install Vue Router 4 for routing with URL pattern `/player/:username/:platform`, and use @vueuse/core's `useTitle()` composable for dynamic page titles. Defer full Open Graph implementation (deferred per CONTEXT.md) as it requires server-side rendering for reliable social media crawling.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vue-router | 4.x | Official client-side routing for Vue 3 | Built by Vue team, Composition API support, official documentation |
| @vueuse/core | ^14.2.0 | Composition utilities (already installed) | `useTitle()` for reactive document titles, `useBreakpoints()` for responsive detection |
| pinia | ^3.0.4 | State management (already installed) | Route params to store integration, existing player store |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vueuse/head | 1.x / unhead | Dynamic meta tags (OG, Twitter) | Deferred per CONTEXT.md - requires SSR for reliable social sharing |
| vite-plugin-legacy | 3.x | Fallback for older browsers | Optional - not needed for modern stat tracker |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vue Router 4 | Unplugin Vue Router | File-based routing like Nuxt, but overkill for 2 routes |
| useTitle() | vue-meta | vue-meta is deprecated for Vue 3, not actively maintained |
| Client-side routing | Nuxt 3 | Full SSR framework - excessive for this use case |

**Installation:**
```bash
npm install vue-router@4
```

Note: @vueuse/core is already installed per package.json, so `useTitle()` is available immediately.

## Architecture Patterns

### Recommended Project Structure

```
src/
├── router/           # NEW: Vue Router configuration
│   ├── index.js      # Router instance with routes
│   └── routes.js     # Route definitions (optional, can be in index.js)
├── views/            # NEW: Route-level components
│   ├── HomeView.vue  # Homepage (current App.vue search form)
│   └── PlayerView.vue # Player stats profile page
├── components/       # EXISTING: Reusable components
│   ├── search/       # Search input, platform select, button
│   ├── stats/        # Stats list, player header
│   └── ui/           # Base components
└── stores/           # EXISTING: Pinia stores
    ├── player.js     # Player data store
    └── search.js     # Search history store
```

### Pattern 1: Vue Router Setup with Vite

**What:** Create router instance using Vue Router 4's `createRouter()` with history mode.

**When to use:** Standard Vue 3 + Vite application setup.

**Example:**
```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PlayerView from '@/views/PlayerView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Apex Legends Stats Tracker - Lookup Player Ranks & Stats'
    }
  },
  {
    // Dynamic route for player profiles
    // URL format: /player/Username/origin
    path: '/player/:username/:platform',
    name: 'player',
    component: PlayerView,
    props: true, // Pass route params as props
    meta: {
      // Dynamic title will be set in component
      titleTemplate: (route) => `${route.params.username} - Apex Legends Stats`
    }
  },
  {
    // Catch-all 404 route - MUST be last
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '404 - Player Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Optional: scroll to top on navigation
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
```

**Source:** [Vue Router Official Documentation - Getting Started](https://router.vuejs.org/guide/)

### Pattern 2: Dynamic Route Matching with Params

**What:** URL parameters for username and platform, accessible via `route.params`.

**When to use:** Shareable URLs for player profiles.

**Example:**
```javascript
// In PlayerView.vue
<script setup>
import { useRoute } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { watchEffect } from 'vue'

const route = useRoute()
const playerStore = usePlayerStore()

// Extract params from route
const { username, platform } = route.params

// Auto-fetch on mount when URL is shared
watchEffect(() => {
  if (username && platform) {
    playerStore.searchPlayer(username, platform)
  }
})
</script>
```

**Source:** [Vue Router - Dynamic Route Matching](https://router.vuejs.org/guide/essentials/dynamic-matching.html)

### Pattern 3: Dynamic Page Titles with useTitle()

**What:** Reactive document title updates using VueUse `useTitle()` composable.

**When to use:** Any time route or data changes require title update.

**Example:**
```javascript
// src/composables/usePageTitle.js
import { useTitle } from '@vueuse/core'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

export function usePageTitle() {
  const route = useRoute()

  // Homepage title
  const title = useTitle('Apex Legends Stats Tracker - Lookup Player Ranks & Stats', {
    // Template for player pages
    titleTemplate: '%s | Apex Tracker'
  })

  // Update title based on route
  watch(
    () => route.name,
    (routeName) => {
      if (routeName === 'player') {
        // Player name first for SEO per CONTEXT.md
        const playerName = route.params.username
        title.value = `${playerName} - Apex Legends Stats`
      } else if (routeName === 'NotFound') {
        title.value = '404 - Player Not Found'
      } else {
        title.value = 'Apex Legends Stats Tracker - Lookup Player Ranks & Stats'
      }
    },
    { immediate: true }
  )

  return { title }
}
```

**Source:** [VueUse - useTitle](https://vueuse.org/core/useTitle/)

### Pattern 4: 404 Handling with Catch-All Route

**What:** Catch-all route using `/:pathMatch(.*)*` syntax for unmatched paths.

**When to use:** Handle invalid URLs gracefully (per CONTEXT.md: "fail hard with 404").

**Example:**
```vue
<!-- src/views/NotFoundView.vue -->
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="not-found">
    <h1>404 - Player Not Found</h1>
    <p>The player you're looking for doesn't exist on this platform.</p>
    <BaseButton @click="router.push('/')">Search for another player</BaseButton>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: var(--spacing-2xl);
}
</style>
```

**Source:** [Vue Router - Catch all / 404 Not found Route](https://router.vuejs.org/guide/essentials/dynamic-matching.html#catch-all-404-not-found-route)

### Anti-Patterns to Avoid

- **Simple wildcard `*` routes:** Deprecated in Vue Router 4+. Use `/:pathMatch(.*)*` instead.
- **Manual DOM title updates:** Don't use `document.title = ...` directly. Use `useTitle()` for reactivity.
- **Forgotten 404 route position:** The catch-all route must be LAST in routes array, or it will match all paths.
- **Missing server config:** History mode requires server fallback configuration (see Pitfalls).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL routing | Custom hash parsing, window.location listeners | Vue Router 4 | Edge cases: back/forward button, browser history, scroll restoration |
| Reactive titles | Manual document.title updates | VueUse `useTitle()` | Automatic cleanup, template support, reactive updates |
| Breakpoints | Window resize listeners, manual media queries | VueUse `useBreakpoints()` | SSR support, composable API, multiple breakpoint presets |
| Meta tags | DOM manipulation createElement, appendChild | @vueuse/head (deferred) | Reactivity, TypeScript support, proper cleanup |

**Key insight:** Custom routing solutions fail on edge cases like browser navigation, deep linking, and SSR compatibility. Vue Router is battle-tested and handles these correctly.

## Common Pitfalls

### Pitfall 1: 404 Route Shows on Page Refresh

**What goes wrong:** After deploying, visiting a route like `/player/ExampleUser/origin` directly shows the server's 404 page instead of the Vue app.

**Why it happens:** In history mode, Vue Router uses clean URLs (no `#`). The server tries to find `/player/ExampleUser/origin` as a real file and fails.

**How to avoid:** Configure server to fallback to `index.html` for all routes.

**Prevention strategy:**
```nginx
# Nginx configuration
location / {
  try_files $uri $uri/ /index.html;
}
```

```apache
# Apache .htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Warning signs:** Works in dev but fails in production after direct link visit or refresh.

### Pitfall 2: Social Media Crawlers Ignore Client-Side Meta Tags

**What goes wrong:** Open Graph tags set with JavaScript don't appear when sharing links on Twitter, Facebook, Discord.

**Why it happens:** Most social crawlers execute limited or no JavaScript. They see the initial HTML only.

**How to avoid:** This is a known limitation of client-side apps. Per CONTEXT.md, OG images are **deferred**. For this phase, focus on:
1. Static meta tags in `index.html` (site-level description, default OG image)
2. Dynamic page titles (these work because crawlers do read `<title>`)

**Warning signs:** Sharing a URL shows incorrect preview card in social media debuggers.

### Pitfall 3: Route Param Changes Don't Refetch Data

**What goes wrong:** Navigating from `/player/User1/origin` to `/player/User2/origin` reuses the same component instance without fetching new data.

**Why it happens:** Vue Router reuses components for the same route pattern to improve performance. Lifecycle hooks (`onMounted`) don't re-run.

**How to avoid:** Watch route params for changes and refetch:
```javascript
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

watch(
  () => ({ username: route.params.username, platform: route.params.platform }),
  ({ username, platform }) => {
    playerStore.searchPlayer(username, platform)
  },
  { immediate: true }
)
```

**Warning signs:** Player data doesn't update when URL changes manually.

### Pitfall 4: Breakpoints Don't Match Design Requirements

**What goes wrong:** Mobile layout doesn't activate at 768px as specified in CONTEXT.md.

**Why it happens:** Using default breakpoint presets (Tailwind uses 640px for `sm`, 768px for `md`).

**How to avoid:** Define custom breakpoints matching CONTEXT.md:
```javascript
import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints({
  mobile: 0,
  tablet: 768,  // CONTEXT.md breakpoint
  laptop: 1024,
  desktop: 1280,
})

const isMobile = breakpoints.smaller('tablet')  // true < 768px
```

**Warning signs:** Layout breaks between 640px-768px (small tablets, large phones).

## Code Examples

### Router Registration in main.js

```javascript
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)  // MUST be before mount()

app.mount('#app')
```

### Share Button with Clipboard

```javascript
// src/composables/useSharePlayer.js
import { ref } from 'vue'
import { useRoute } from 'vue-router'

export function useSharePlayer() {
  const route = useRoute()
  const copied = ref(false)

  async function sharePlayer() {
    // Get current URL
    const url = window.location.href

    // Use Web Share API if available (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${route.params.username} - Apex Legends Stats`,
          url: url
        })
        return true
      } catch {
        // User cancelled, fall through to clipboard
      }
    }

    // Fallback: clipboard
    try {
      await navigator.clipboard.writeText(url)
      copied.value = true
      setTimeout(() => copied.value = false, 2000)
      return true
    } catch {
      return false
    }
  }

  return { sharePlayer, copied }
}
```

### Navigation After Search

```javascript
// In search handler
import { useRouter } from 'vue-router'

const router = useRouter()

async function handleSearch() {
  const result = await playerStore.searchPlayer(username.value, platform.value)

  if (result.success) {
    // Navigate to player profile URL
    await router.push({
      name: 'player',
      params: {
        username: username.value,
        platform: platform.value
      }
    })
  }
}
```

### Semantic HTML Structure for Player View

```vue
<!-- PlayerView.vue - semantic structure -->
<template>
  <article class="player-profile" itemscope itemtype="https://schema.org/Person">
    <header class="player-profile__header">
      <!-- Player avatar and name -->
      <img
        :src="player.avatar"
        :alt="`${player.name} avatar`"
        class="player-avatar"
        itemprop="image"
      />
      <h1 class="player-name" itemprop="name">
        {{ player.name }}
      </h1>
      <p class="player-platform">
        Playing on <span itemprop="affiliation">{{ platformName }}</span>
      </p>
    </header>

    <section class="stats-section" aria-labelledby="stats-heading">
      <h2 id="stats-heading" class="visually-hidden">Player Statistics</h2>
      <StatsList :stats="player.stats" />
    </section>

    <section class="legends-section" aria-labelledby="legends-heading">
      <h2 id="legends-heading" class="visually-hidden">Favorite Legends</h2>
      <FavoriteLegends :legends="player.legends" />
    </section>
  </article>
</template>

<style>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
```

### Mobile Responsive Layout (768px breakpoint)

```css
/* CONTEXT.md: 768px breakpoint, single column layout */

@media (max-width: 768px) {
  .player-profile {
    padding: var(--spacing-md);
  }

  .player-profile__header {
    flex-direction: column;
    text-align: center;
  }

  .stats-section,
  .legends-section {
    /* Full width on mobile */
    width: 100%;
    margin: var(--spacing-md) 0;
  }

  /* Stack legend cards vertically */
  .legend-cards {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| vue-meta (Vue 2) | @vueuse/head / unhead | 2021+ | vue-meta deprecated, Unhead is framework-agnostic |
| `*` wildcard routes | `/:pathMatch(.*)*` | Vue Router 4 (2021) | Old syntax throws error in v4+ |
| Manual breakpoint tracking | VueUse `useBreakpoints()` | 2020+ | Reactive, SSR-safe, composable |
| Server-side routing | Client-side SPA routing | 2020+ | Faster navigation, requires server fallback config |

**Deprecated/outdated:**
- **vue-meta:** Not maintained for Vue 3. Use @vueuse/head or Unhead.
- **Simple `path: '*'` catch-all:** Replaced by `path: '/:pathMatch(.*)*'` in Vue Router 4.
- **Options API routing guards:** Still works, but Composition API `watch()` on route is preferred in Vue 3.

## Open Questions

### 1. URL Format: Username Encoding

**What we know:** URL pattern will be `/player/:username/:platform`. Usernames may contain special characters.

**What's unclear:** How Apex Legends handles usernames with spaces, special characters, or non-ASCII characters.

**Recommendation:** Use `encodeURIComponent()` when constructing URLs, and `decodeURIComponent()` when reading params. Test with real usernames containing spaces or special characters. Consider if usernames should be URL-slugged (replace spaces with dashes).

### 2. 404 Behavior: API Error vs. Invalid Route

**What we know:** Invalid URL patterns should show 404. But valid URLs with non-existent players present an API error case.

**What's unclear:** Should `/player/NonExistentUser/origin` (valid route pattern, player doesn't exist) show:
- Option A: Same 404 page as invalid routes?
- Option B: An error state on the PlayerView component?
- Option C: Redirect to home with error message?

**Recommendation:** Per CONTEXT.md "fail hard with 404", Option A is consistent. However, consider different UX: 404 page for invalid routes, error message in PlayerView for API 404s. This allows user to correct the username without losing their place.

### 3. Platform Validation in URL

**What we know:** URL will include `:platform` parameter.

**What's unclear:** Should invalid platform slugs (e.g., `/player/Username/invalid`) show 404 or redirect?

**Recommendation:** Implement a route guard to validate platform against `PLATFORMS` constant from `constants.js`. Invalid platforms should redirect to 404.

```javascript
router.beforeEach((to, from, next) => {
  if (to.name === 'player') {
    const validPlatforms = ['origin', 'xbl', 'psn'] // from PLATFORMS
    if (!validPlatforms.includes(to.params.platform)) {
      next({ name: 'NotFound' })
      return
    }
  }
  next()
})
```

## Sources

### Primary (HIGH confidence)

- [Vue Router Official Documentation - Getting Started](https://router.vuejs.org/guide/) - Complete setup guide for Vue Router 4 with Vite
- [Vue Router - Dynamic Route Matching](https://router.vuejs.org/guide/essentials/dynamic-matching.html) - Route params, watching for changes, catch-all routes
- [VueUse - useTitle](https://vueuse.org/core/useTitle/) - Reactive document title management
- [VueUse - useBreakpoints](https://vueuse.org/core/useBreakpoints/) - Reactive viewport breakpoints with SSR support
- [Unhead useHead() Composable](https://unhead.unjs.io/docs/head/api/composables/use-head) - Modern head management (deferred per CONTEXT.md)

### Secondary (MEDIUM confidence)

- [Stack Overflow - Vue Router 404 handling](https://stackoverflow.com/questions/40193634/vue-router-redirect-on-page-not-found-404) - Community discussion on catch-all patterns
- [Dev.to - Semantic HTML in 2025](https://dev.to/gerryleonugroho/semantic-html-in-2025-the-bedrock-of-accessible-seo-ready-and-future-proof-web-experiences-2k01) - Modern semantic HTML best practices
- [Nuxt SEO Guide - Vue](https://nuxtseo.com/learn-seo/vue) - Vue SEO considerations (verified with official docs)

### Tertiary (LOW confidence)

- Various WebSearch results regarding vue-meta deprecation (verified with official Unhead documentation)
- Community discussions on social sharing in Vue applications (need validation for this specific use case)

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** - Vue Router 4 and VueUse are official, well-documented solutions
- Architecture: **HIGH** - Patterns from official Vue Router and VueUse documentation
- Pitfalls: **HIGH** - Well-documented issues with server configuration and route reuse

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - stable ecosystem)

---

*Phase: 03-seo-sharing*
*Research completed: 2026-02-05*
