<script setup>
/**
 * StatsList - Displays overview stats in vertical list format
 *
 * IMPORTANT: CONTEXT.md locked decision specifies "List view for stats (not cards or grid)"
 * This component uses a vertical list layout with label-value pairs, NOT a grid or card layout.
 *
 * @props {Array} stats - Array of stat objects with { subtitle, stat }
 */

import { ref, watch, computed } from 'vue'
import BaseCard from '@/components/ui/BaseCard.vue'

const props = defineProps({
  stats: {
    type: Array,
    default: () => []
  }
})

const hasStats = computed(() => {
  return props.stats && props.stats.length > 0
})

// Force re-render trigger for replaying animations
const animKey = ref(0)

watch(() => props.stats, () => {
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
      <template #header>
        <h3 class="stats-list__header">Stats Overview</h3>
      </template>

      <div class="stats-list__content">
        <div
          v-for="(stat, index) in stats"
          :key="`stat-${index}-${stat.subtitle}`"
          class="stats-list__row"
          :class="{ 'stats-list__row--last': index === stats.length - 1 }"
        >
          <span class="stats-list__label">{{ stat.subtitle }}</span>
          <span class="stats-list__value">{{ stat.stat }}</span>
        </div>
      </div>
    </BaseCard>
  </Transition>

  <BaseCard v-else class="stats-list stats-list--empty">
    <div class="stats-list__empty">
      <p>No stats available</p>
    </div>
  </BaseCard>
</template>

<style scoped>
@import '@/style/transitions.css';
.stats-list {
  width: 100%;
}

.stats-list__header {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stats-list__content {
  display: flex;
  flex-direction: column;
}

.stats-list__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-light);
  transition: background-color var(--transition-fast);
}

.stats-list__row:last-child,
.stats-list__row--last {
  border-bottom: none;
}

.stats-list__row:hover {
  background-color: var(--bg-card);
  margin: 0 calc(-1 * var(--spacing-lg));
  padding-left: var(--spacing-lg);
  padding-right: var(--spacing-lg);
  border-radius: var(--radius-sm);
}

.stats-list__label {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
}

.stats-list__value {
  font-size: 1.125rem;
  color: var(--text-primary);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.stats-list__empty {
  padding: var(--spacing-lg);
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* Mobile responsiveness */
@media (max-width: 480px) {
  .stats-list__header {
    font-size: 0.875rem;
  }

  .stats-list__row {
    padding: var(--spacing-sm) 0;
  }

  .stats-list__label {
    font-size: 0.8125rem;
  }

  .stats-list__value {
    font-size: 1rem;
  }

  .stats-list__row:hover {
    margin: 0 calc(-1 * var(--spacing-md));
    padding-left: var(--spacing-md);
    padding-right: var(--spacing-md);
  }
}
</style>
