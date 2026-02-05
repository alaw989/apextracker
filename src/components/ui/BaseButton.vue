<script setup>
/**
 * BaseButton - Reusable button component
 *
 * @props {string} variant - Button style variant: 'primary' | 'secondary' | 'danger'
 * @props {boolean} disabled - Whether the button is disabled
 * @props {boolean} loading - Whether to show loading state
 * @emits click - Emitted when button is clicked
 */

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

function handleClick(e) {
  if (!props.disabled && !props.loading) {
    emit('click', e)
  }
}
</script>

<template>
  <button
    :class="[
      'base-button',
      `base-button--${variant}`,
      {
        'base-button--disabled': disabled || loading,
        'base-button--loading': loading
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="base-button__spinner"></span>
    <span class="base-button__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: 1rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  cursor: pointer;
  min-height: 42px;
  position: relative;
}

/* Variants */
.base-button--primary {
  background-color: var(--accent-primary);
  color: var(--text-primary);
  border: 1px solid var(--accent-primary);
}

.base-button--primary:hover:not(.base-button--disabled) {
  background-color: var(--accent-primary-hover);
  border-color: var(--accent-primary-hover);
}

.base-button--secondary {
  background-color: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background-color: var(--border-light);
  border-color: var(--border-light);
}

.base-button--danger {
  background-color: var(--accent-danger);
  color: var(--text-primary);
  border: 1px solid var(--accent-danger);
}

.base-button--danger:hover:not(.base-button--disabled) {
  background-color: var(--accent-danger-hover);
  border-color: var(--accent-danger-hover);
}

/* Disabled state */
.base-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading state */
.base-button--loading {
  cursor: wait;
}

.base-button__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--text-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.base-button__content {
  display: inline-flex;
  align-items: center;
}
</style>
