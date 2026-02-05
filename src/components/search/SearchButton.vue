<script setup>
/**
 * SearchButton - Search trigger button with loading state
 *
 * Button component that wraps BaseButton with loading spinner.
 * Emits click event only when not disabled or loading.
 *
 * @props {boolean} loading - Whether to show loading state
 * @props {boolean} disabled - Whether the button is disabled
 * @emits click - Emitted when button is clicked (not if disabled/loading)
 */

import { computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  ariaLabel: {
    type: String,
    default: 'Search for player'
  },
  loadingLabel: {
    type: String,
    default: 'Searching...'
  }
})

const emit = defineEmits(['click'])

/**
 * Computed aria-label based on loading state
 */
const computedAriaLabel = computed(() => {
  return props.loading ? props.loadingLabel : props.ariaLabel
})

/**
 * Handle button click
 * @param {MouseEvent} event - Mouse event
 */
function handleClick(event) {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <BaseButton
    :class="['search-button', { 'search-button--loading': loading }]"
    variant="primary"
    :disabled="disabled || loading"
    :loading="loading"
    :aria-label="computedAriaLabel"
    @click="handleClick"
  >
    <slot />
  </BaseButton>
</template>

<style scoped>
.search-button {
  min-width: 100px;
}

.search-button--loading {
  pointer-events: none;
}
</style>
