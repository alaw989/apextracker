<script setup>
/**
 * App - Main application component
 *
 * Root component that renders RouterView for page navigation.
 * AppBackground displays dynamic backgrounds based on favorite legend.
 */

import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import { RouterView } from 'vue-router'
import { usePageTitle } from '@/composables/usePageTitle'
import AppBackground from '@/components/visual/AppBackground.vue'

// Initialize page title management
usePageTitle()

// Pinia store
const playerStore = usePlayerStore()

// Store refs for reactive access
const { data } = storeToRefs(playerStore)

/**
 * Computed favorite legend from player data
 * Returns the first legend (index 0) which is sorted by kills
 */
const favoriteLegend = computed(() => {
  if (!data.value?.legends?.length) {
    return null
  }
  return data.value.legends[0]
})
</script>

<template>
  <AppBackground :favorite-legend="favoriteLegend" />
  <div class="app">
    <div class="app__container">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-2xl) var(--spacing-md);
}

.app__container {
  width: 100%;
  max-width: 800px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .app {
    padding: var(--spacing-lg) var(--spacing-sm);
  }
}
</style>
