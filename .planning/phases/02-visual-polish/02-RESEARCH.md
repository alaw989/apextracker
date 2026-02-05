# Phase 02: Visual Polish - Research

**Researched:** 2026-02-05
**Domain:** Vue 3 animations, CSS transitions, dynamic backgrounds
**Confidence:** HIGH

## Summary

This phase research covers Vue 3 animation best practices for implementing visual polish in an Apex Legends stats tracker. The two main requirements are: (1) dynamic background changes based on the player's favorite legend, and (2) smooth stat card animations when data appears after searching.

**Key findings:**
- Vue 3.5's built-in `<Transition>` and `<TransitionGroup>` components are the standard solution for enter/leave and list animations
- CSS transitions are preferred over JavaScript animations for simple effects (fade, slide) due to better performance
- Dynamic background image transitions require special handling since CSS transitions don't work directly on `background-image`
- Staggered animations for lists use either CSS `:nth-child()` delays or JavaScript hooks with data attributes

**Primary recommendation:** Use Vue's built-in `<Transition>` and `<TransitionGroup>` components with CSS transitions for all animations. For background transitions, use a two-layer overlay approach with CSS opacity crossfades.

## Standard Stack

The project already has all necessary dependencies. No additional libraries are required.

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vue | 3.5.27 | Built-in `<Transition>` and `<TransitionGroup>` components | Official, built-in animation solution |
| @vueuse/core | 14.2.0 | Composables like `useCssVar` for dynamic styling | Vue ecosystem standard for utilities |
| Pinia | 3.0.4 | State management for player data | Already used for player store |

### Animation Libraries (Not Recommended)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| GSAP | Latest | Complex, timeline-based animations | Only for very complex sequencing (not needed here) |
| Anime.js | Latest | JS-based animations | Only when CSS transitions are insufficient |
| AutoAnimate | Latest | Automatic layout animations | Useful for FLIP animations but overkill here |

**Installation:**
No additional packages needed. The project already has Vue 3.5 with built-in transition components.

## Architecture Patterns

### Dynamic Background Pattern

Vue's `<Transition>` component requires actual DOM changes to trigger animations. Simply changing a `backgroundImage` style binding won't trigger transitions because CSS doesn't support transitioning `background-image` directly.

**Recommended approach: Two-layer crossfade**

```vue
<script setup>
import { computed, watch, nextTick, ref } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { getBackgroundForLegend } from '@/utils/backgrounds'

const playerStore = usePlayerStore()
const { data } = storeToRefs(playerStore)

// Track background change for transition
const backgroundKey = ref(0)
const currentBg = ref('')

// Computed background path from favorite legend
const backgroundPath = computed(() => {
  if (!data.value?.legends?.length) return null
  const favorite = data.value.legends[0]
  return getBackgroundForLegend(favorite.name)
})

// Watch for changes and trigger transition
watch(backgroundPath, (newPath) => {
  if (newPath && newPath !== currentBg.value) {
    currentBg.value = newPath
    backgroundKey.value++ // Forces re-render for transition
  }
}, { immediate: true })
</script>

<template>
  <div class="app-background">
    <Transition name="bg-fade" mode="out-in">
      <div
        :key="backgroundKey"
        class="app-background__image"
        :style="{ backgroundImage: `url(${currentBg})` }"
      />
    </Transition>
    <div class="app-background__overlay" />
  </div>
</template>

<style>
/* Background crossfade - opacity transition only */
.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 0.6s ease-in-out;
}

.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}

.app-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.app-background__image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.app-background__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(15, 23, 42, 0.85),
    rgba(15, 23, 42, 0.95)
  );
}
</style>
```

**Source:** [Vue.js Transition Documentation](https://vuejs.org/guide/built-ins/transition)

### Stat Card Animation Pattern

Use `<Transition>` for single components and `<TransitionGroup>` for lists. For stat cards appearing in sequence, use staggered CSS delays.

```vue
<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  stats: {
    type: Array,
    default: () => []
  }
})

// Force re-render trigger for replaying animations
const animKey = ref(0)

watch(() => props.stats, () => {
  // Increment key to force transition replay
  animKey.value++
}, { immediate: true })
</script>

<template>
  <Transition
    name="card-appear"
    :key="animKey"
    appear
  >
    <BaseCard v-if="hasStats" class="stats-list">
      <!-- Content -->
    </BaseCard>
  </Transition>
</template>

<style>
/* Card fade + slide up animation */
.card-appear-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-appear-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* Performance: Only animate transform and opacity */
</style>
```

### Staggered List Animation Pattern

For animating multiple legend cards in sequence:

```vue
<template>
  <TransitionGroup
    name="stagger"
    tag="div"
    class="favorite-legends__list"
  >
    <LegendCard
      v-for="(legend, index) in topLegends"
      :key="`legend-${legend.name}-${index}`"
      :legend="legend"
      :is-favorite="index === 0"
      :data-index="index"
      class="favorite-legends__item"
    />
  </TransitionGroup>
</template>

<style>
/* Base transition for all items */
.stagger-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.stagger-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Stagger delays using nth-child */
.stagger-move,
.stagger-enter-active:nth-child(1) {
  transition-delay: 0ms;
}

.stagger-enter-active:nth-child(2) {
  transition-delay: 100ms;
}
</style>
```

**Alternative JavaScript-based staggering** (for dynamic delays):

```vue
<script setup>
function onBeforeEnter(el) {
  el.style.opacity = 0
}

function onEnter(el, done) {
  const delay = el.dataset.index * 100
  setTimeout(() => {
    el.style.transition = 'all 0.4s ease'
    el.style.opacity = 1
    el.style.transform = 'translateY(0)'
    setTimeout(done, 400)
  }, delay)
}
</script>

<template>
  <TransitionGroup
    :css="false"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
  >
    <!-- items with :data-index -->
  </TransitionGroup>
</template>
```

**Source:** [Vue.js TransitionGroup Documentation](https://vuejs.org/guide/built-ins/transition-group)

### Anti-Patterns to Avoid

- **Don't animate `background-image` directly**: CSS doesn't support it. Use the two-layer crossfade pattern.
- **Don't animate layout properties**: Avoid animating `height`, `width`, `margin`, `padding`. These trigger expensive layout recalculations. Use `transform` and `opacity` instead.
- **Don't use JavaScript animations for simple effects**: CSS transitions are more performant for fades, slides, and scales.
- **Don't forget the `:key` for transition replay**: To re-trigger animations on new data, you must force re-render by changing the component's key.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Enter/leave animations | Custom setTimeout/class toggling | `<Transition>` component | Vue handles timing, cleanup, and lifecycle automatically |
| List animations | Manual index-based delays | `<TransitionGroup>` | Built-in support for move/enter/leave with move-class for FLIP |
| Animation timing | Custom requestAnimationFrame | CSS `transition` | Browser-optimized, GPU-accelerated |
| Staggered delays | Manual delay calculations | CSS `:nth-child()` or data-index | Declarative, easier to maintain |

**Key insight:** Vue's transition system is specifically designed to handle the complex timing and DOM manipulation that would otherwise require hundreds of lines of code.

## Common Pitfalls

### Pitfall 1: Background Image Transitions Don't Work

**What goes wrong:** You bind `backgroundImage` to a computed property and add a CSS `transition`, but the background snaps between images with no fade effect.

**Why it happens:** CSS transitions don't support the `background-image` property. The browser can't interpolate between two different image URLs.

**How to avoid:**
- Use the two-layer crossfade pattern (one background fades out while another fades in)
- Or use Vue's `<Transition>` with `mode="out-in"` to swap between two absolutely positioned div elements

**Warning signs:** Background changes happen instantly with no smooth transition, or transition properties seem to be ignored.

### Pitfall 2: Animations Don't Replay on New Data

**What goes wrong:** The first search triggers animations, but subsequent searches show no animation effect.

**Why it happens:** Vue reuses DOM elements by default for performance. If the component structure doesn't change, transitions don't trigger again.

**How to avoid:**
- Use a `:key` binding that changes when new data arrives
- Increment a counter when searching and bind it as `:key="animKey"`
- Or use `appear` prop for initial render only, then force re-mount

**Warning signs:** Animations work on first load but not on data updates.

### Pitfall 3: Animating Expensive Properties

**What goes wrong:** Animations feel janky or cause the browser to hang, especially on mobile devices.

**Why it happens:** Animating properties like `height`, `width`, `margin`, or `padding` triggers CSS layout recalculation on every frame. These are much more expensive than `transform` and `opacity`.

**How to avoid:**
- Only animate `transform` (translate, scale, rotate) and `opacity`
- These properties are compositing operations that run on the GPU
- If you need to animate height, use `grid-template-rows: 0fr` to `1fr` with overflow hidden

**Warning signs:** Choppy animations, high CPU usage during transitions.

### Pitfall 4: TransitionGroup Items Jump Instead of Move

**What goes wrong:** When an item is removed from a list, other items jump to their new positions instead of sliding smoothly.

**Why it happens:** The `.leave-active` class needs `position: absolute` to take the item out of layout flow during the exit animation.

**How to avoid:**
```css
/* Add this to your TransitionGroup CSS */
.list-leave-active {
  position: absolute;
}

.list-move {
  transition: transform 0.5s ease;
}
```

**Warning signs:** List items snap/jerk when items are added or removed.

### Pitfall 5: Staggered Delays Don't Work

**What goes wrong:** You set `transition-delay` but all items animate simultaneously.

**Why it happens:** When using `<TransitionGroup>`, the `:key` must change for transitions to trigger. If keys are stable indices, Vue reuses elements without animation.

**How to avoid:**
- Ensure keys are unique and include item identity: `:key="item.id"`
- For stable data, use a computed key that includes a data version: `:key="item.id + '-' + dataVersion"`
- Or use JavaScript hooks with explicit delays based on `el.dataset.index`

**Warning signs:** All items animate at once despite different nth-child delays.

## Code Examples

### Enter/Leave Transition with Fade and Slide

```vue
<!-- Source: https://vuejs.org/guide/built-ins/transition -->
<Transition name="slide-fade">
  <p v-if="show">hello</p>
</Transition>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
```

### Transition with Mode for Sequential Animations

```vue
<!-- Source: https://vuejs.org/guide/built-ins/transition -->
<Transition mode="out-in">
  <component :is="activeComponent" />
</Transition>
```

Available modes:
- `out-in`: Current element animates out first, then new element animates in (most common)
- `in-out`: New element animates in first, then current element animates out (rarely used)

### Forcing Animation Replay with Key

```vue
<!-- Source: https://vuejs.org/guide/built-ins/transition#transitions-with-the-key-attribute -->
<script setup>
import { ref, setInterval } from 'vue'

const count = ref(0)

setInterval(() => count.value++, 1000)
</script>

<template>
  <Transition>
    <!-- Without :key, only text would update -->
    <!-- With :key, entire span re-renders, triggering transition -->
    <span :key="count">{{ count }}</span>
  </Transition>
</template>
```

### Reusable Transition Component

```vue
<!-- MyTransition.vue -->
<script setup>
// JavaScript hooks logic...
</script>

<template>
  <Transition
    name="my-transition"
    @enter="onEnter"
    @leave="onLeave"
  >
    <slot></slot>
  </Transition>
</template>

<style>
/* Don't use scoped - transition classes apply to slot content */
.my-transition-enter-active,
.my-transition-leave-active {
  transition: opacity 0.3s ease;
}

.my-transition-enter-from,
.my-transition-leave-to {
  opacity: 0;
}
</style>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual setTimeout + class toggling | Built-in `<Transition>` component | Vue 2.0+ | Less code, automatic cleanup |
| JavaScript animation libraries | CSS transitions for simple effects | Ongoing | Better performance, less JS |
| Complex key hacks for re-render | `mode="out-in"` for sequential transitions | Vue 2.0+ | Declarative sequential animations |
| CSS `background-image` transition attempts | Two-layer crossfade with opacity | Ongoing | `background-image` still not transitionable |

**Deprecated/outdated:**
- Vue 2 `<transition>` with `v-bind:css="false"` is now less common; CSS-first approach is preferred
- Manual re-render methods (`this.$forceUpdate()`) in Vue 2 replaced by `:key` changes in Vue 3

### Vue 3.5 Features (Current Version)

The project uses Vue 3.5.27, which includes:
- Reactivity system improvements for better performance
- Improved transition handling with automatic CSS detection
- Better TypeScript support for transition components

## Open Questions

1. **Background preload timing**
   - What we know: Images should be preloaded to prevent flash of empty background
   - What's unclear: Whether to preload in the player store or component-level
   - Recommendation: Preload when player data is fetched, store preloaded URLs in state

2. **Animation replay on search**
   - What we know: Need to force re-render using `:key` changes
   - What's unclear: Optimal key structure (simple counter vs data-based)
   - Recommendation: Use a data-based key like `${playerName}-${timestamp}` to ensure unique keys per search

## Sources

### Primary (HIGH confidence)
- [Vue.js Official Documentation - Transition](https://vuejs.org/guide/built-ins/transition) - Complete transition API, CSS classes, JavaScript hooks
- [Vue.js Official Documentation - TransitionGroup](https://vuejs.org/guide/built-ins/transition-group) - List animations, move transitions, staggering
- [MDN - CSS and JavaScript Animation Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance) - Performance best practices for web animations

### Secondary (MEDIUM confidence)
- [Dev.to - Stagger Animation with Vue 3 and CSS](https://dev.to/ranggapr/stagger-animation-with-vue-3-and-css-99g) - Practical stagger pattern examples (verified with official docs)
- [StackOverflow - Smooth background image transition](https://stackoverflow.com/questions/58162050/smooth-transition-while-changing-background-image) - Background crossfade techniques (verified implementation)
- [CSS-Tricks - cross-fade() function](https://css-tricks.com/almanac/functions/c/cross-fade/) - CSS cross-fade alternatives

### Tertiary (LOW confidence)
- [Medium - 9 CSS Animation Techniques 2026](https://mohammadtabishanwar9.medium.com/9-css-animation-techniques-that-make-uis-feel-alive-in-2026-a8e48b472488) - General CSS animation trends
- [Code Tuts+ - Vue.js Transitions](https://code.tutsplus.com/design-better-ux-with-vuejs-transitions-and-animations--cms-32050t) - Vue transition UX patterns (older, but concepts verified)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Vue 3.5 built-in transitions are the documented standard
- Architecture: HIGH - Official Vue documentation and verified implementation patterns
- Pitfalls: HIGH - Well-documented issues in Vue community, verified against official docs

**Research date:** 2026-02-05
**Valid until:** 2026-05-05 (90 days - Vue 3 transition system is stable)
