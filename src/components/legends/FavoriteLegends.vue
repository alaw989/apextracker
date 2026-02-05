<script setup>
/**
 * FavoriteLegends - Displays top 2 legends by kills
 *
 * @props {Array} legends - Array of legend objects with { name, imageUrl, kills }
 */

import { ref, watch, computed } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import LegendCard from './LegendCard.vue'

const props = defineProps({
  legends: {
    type: Array,
    default: () => []
  }
})

const hasLegends = computed(() => {
  return props.legends && props.legends.length > 0
})

// Take only top 2 legends (should already be sorted from API)
const topLegends = computed(() => {
  return props.legends.slice(0, 2)
})

// Force re-render trigger for replaying animations
const animKey = ref(0)

watch(() => props.legends, () => {
  animKey.value++
}, { immediate: true })
</script>

<template>
  <div v-if="hasLegends" class="favorite-legends">
    <h3 class="favorite-legends__header">Favorite Legends</h3>
    <TransitionGroup
      name="stagger"
      tag="div"
      :key="animKey"
      class="favorite-legends__list"
      appear
    >
      <LegendCard
        v-for="(legend, index) in topLegends"
        :key="`legend-${legend.name}-${animKey}`"
        :legend="legend"
        :is-favorite="index === 0"
        :data-index="index"
        class="favorite-legends__item"
      />
    </TransitionGroup>
  </div>

  <BaseCard v-else class="favorite-legends favorite-legends--empty">
    <div class="favorite-legends__empty">
      <p>No legends data available</p>
    </div>
  </BaseCard>
</template>

<style scoped>
@import '@/style/transitions.css';
.favorite-legends {
  width: 100%;
}

.favorite-legends__header {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.favorite-legends__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.favorite-legends__item {
  width: 100%;
}

.favorite-legends--empty {
  padding: var(--spacing-lg);
}

.favorite-legends__empty {
  padding: var(--spacing-lg);
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .favorite-legends__header {
    font-size: 0.875rem;
    margin-bottom: var(--spacing-sm);
  }

  .favorite-legends__list {
    gap: var(--spacing-sm);
  }
}

/* Tablet/desktop: optionally show legends side-by-side */
@media (min-width: 640px) {
  .favorite-legends__list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }

  .favorite-legends__item {
    width: 100%;
  }
}
</style>
