<script setup>
/**
 * RefreshButton - Manual refresh trigger button
 *
 * Small circular button with refresh icon.
 * Spins while loading to indicate active refresh.
 */

import { computed } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['refresh'])

// Computed disabled state (loading or explicitly disabled)
const isDisabled = computed(() => {
  return props.loading || props.disabled
})

// Handle click event
function handleClick() {
  if (!isDisabled.value) {
    emit('refresh')
  }
}

// ARIA label based on state
const ariaLabel = computed(() => {
  return props.loading ? 'Refreshing data...' : 'Refresh data'
})
</script>

<template>
  <button
    type="button"
    class="refresh-button"
    :class="{ 'refresh-button--loading': loading }"
    :disabled="isDisabled"
    :aria-label="ariaLabel"
    :aria-busy="loading"
    @click="handleClick"
  >
    <svg
      class="refresh-icon"
      :class="{ 'refresh-icon--spinning': loading }"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M23 4v6h-6M1 20v-6h6M20.49 15a9 9 0 1 1-2.12-9.36L23 10"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<style scoped>
.refresh-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  min-height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background-color: var(--color-surface-secondary);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-button:hover:not(:disabled) {
  background-color: var(--color-surface-tertiary);
  color: var(--color-text-primary);
}

.refresh-button:active:not(:disabled) {
  transform: scale(0.95);
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}

.refresh-icon--spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Mobile responsive */
@media (max-width: 768px) {
  .refresh-button {
    width: 2.25rem;
    height: 2.25rem;
    min-height: 2.25rem;
  }

  .refresh-icon {
    width: 1.125rem;
    height: 1.125rem;
  }
}
</style>
