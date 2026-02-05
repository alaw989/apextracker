<script setup>
/**
 * LoadingSpinner - CSS-only loading spinner component
 *
 * Simple presentation component with size variants and optional text.
 * Uses CSS animation for smooth rotation effect.
 *
 * @props {'small' | 'medium' | 'large'} size - Spinner size
 * @props {string} text - Optional text to display below spinner
 */

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  text: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="loading-spinner" :class="`loading-spinner--${size}`">
    <div class="loading-spinner__circle"></div>
    <p v-if="text" class="loading-spinner__text">{{ text }}</p>
  </div>
</template>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.loading-spinner__circle {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Size variants */
.loading-spinner--small .loading-spinner__circle {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.loading-spinner--medium .loading-spinner__circle {
  width: 32px;
  height: 32px;
}

.loading-spinner--large .loading-spinner__circle {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

.loading-spinner__text {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
