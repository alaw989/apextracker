<script setup>
/**
 * ErrorMessage - Error display component with type variants
 *
 * Displays error messages with appropriate styling based on type.
 * Can be dismissible with optional dismiss button.
 *
 * @props {string} message - The error text to display
 * @props {'error' | 'warning' | 'info'} type - Message type for styling
 * @props {boolean} dismissible - Whether to show dismiss button
 * @emits dismiss - Emitted when dismiss button is clicked
 */

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['dismiss'])

function handleDismiss() {
  emit('dismiss')
}
</script>

<template>
  <div :class="['error-message', `error-message--${type}`]">
    <div class="error-message__content">
      <svg class="error-message__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle v-if="type === 'error'" cx="12" cy="12" r="10"/>
        <path v-if="type === 'error'" d="M12 8v4M12 16h.01"/>
        <path v-if="type === 'warning'" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line v-if="type === 'warning'" x1="12" y1="9" x2="12" y2="13"/>
        <line v-if="type === 'warning'" x1="12" y1="17" x2="12.01" y2="17"/>
        <circle v-if="type === 'info'" cx="12" cy="12" r="10"/>
        <line v-if="type === 'info'" x1="12" y1="16" x2="12" y2="12"/>
        <line v-if="type === 'info'" x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
      <p class="error-message__text">{{ message }}</p>
    </div>
    <button
      v-if="dismissible"
      class="error-message__dismiss"
      @click="handleDismiss"
      aria-label="Dismiss error"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.error-message {
  background-color: var(--bg-darker);
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.error-message--error {
  border: 1px solid var(--accent-danger);
}

.error-message--warning {
  border: 1px solid #f59e0b;
}

.error-message--info {
  border: 1px solid #3b82f6;
}

.error-message__content {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  flex: 1;
}

.error-message__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.error-message--error .error-message__icon {
  color: var(--accent-danger);
}

.error-message--warning .error-message__icon {
  color: #f59e0b;
}

.error-message--info .error-message__icon {
  color: #3b82f6;
}

.error-message__text {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

.error-message__dismiss {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: color var(--transition-fast);
  border-radius: var(--radius-sm);
}

.error-message__dismiss:hover {
  color: var(--text-primary);
  background-color: var(--bg-card);
}

.error-message__dismiss svg {
  width: 16px;
  height: 16px;
}
</style>
