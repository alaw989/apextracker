<script setup>
/**
 * AppBackground - Dynamic legend-themed background component
 *
 * Displays a background image that changes based on the player's favorite legend.
 * Uses Vue's Transition component for smooth crossfade effects.
 */

import { ref, watch, computed } from 'vue'
import { getBackgroundForLegend } from '@/utils/backgrounds.js'

/**
 * Component props
 */
const props = defineProps({
  /**
   * Favorite legend object with { name } property or null
   */
  favoriteLegend: {
    type: Object,
    default: null
  }
})

/**
 * Reactive state for background image and transition key
 * The backgroundKey increments to force Transition to re-render
 */
const backgroundKey = ref(0)
const currentBg = ref('/backgrounds/default.jpg')

/**
 * Computed background path from favorite legend
 * Returns null when no legend data is available
 */
const backgroundPath = computed(() => {
  if (!props.favoriteLegend?.name) {
    return null
  }
  return getBackgroundForLegend(props.favoriteLegend.name)
})

/**
 * Watch for background path changes and trigger transition
 * When the path changes, update currentBg and increment key
 */
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

/* Fixed background container */
.app-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

/* Background image layer */
.app-background__image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

/* Dark overlay for text readability */
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
