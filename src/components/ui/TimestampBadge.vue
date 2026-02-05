<script setup>
/**
 * TimestampBadge - Displays cache age indicator
 *
 * Shows "Updated X min ago" badge for cached data.
 * Displays nothing if timestamp is null (no cached data).
 */

import { computed } from 'vue'
import { timeAgo } from '@/composables/useApiCache.js'

const props = defineProps({
  timestamp: {
    type: Number,
    default: null
  }
})

// Computed formatted time ago string
const formattedTime = computed(() => {
  return timeAgo(props.timestamp)
})

// Only show if we have a timestamp
const isVisible = computed(() => {
  return props.timestamp !== null
})
</script>

<template>
  <span v-if="isVisible" class="timestamp-badge" aria-live="polite">
    Updated {{ formattedTime }}
  </span>
</template>

<style scoped>
.timestamp-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted);
  background-color: var(--color-surface-secondary);
  border-radius: var(--radius-md);
  white-space: nowrap;
  user-select: none;
}

.timestamp-badge::before {
  content: '';
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  margin-right: var(--spacing-xs);
  background-color: var(--color-success);
  border-radius: 50%;
  opacity: 0.7;
}
</style>
