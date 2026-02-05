<script setup>
/**
 * PlatformSelect - Platform selection button group
 *
 * Platform selection component with icon buttons for PC, Xbox, and PlayStation.
 * Uses v-model pattern for two-way binding and supports keyboard navigation.
 *
 * @props {string} modelValue - Currently selected platform ID (origin, xbl, psn)
 * @emits update:modelValue - Emitted when user selects a platform
 */

import { computed, ref } from 'vue'
import { PLATFORMS } from '@/utils/constants'
import { getPlatformIcon } from '@/utils/platformIcons'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'origin',
    validator: (value) => ['origin', 'xbl', 'psn'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

// Track focus for keyboard navigation
const focusedIndex = ref(0)

// Computed for v-model pattern
const selectedPlatform = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

/**
 * Handle platform selection
 * @param {string} platformId - The selected platform ID
 */
function selectPlatform(platformId) {
  selectedPlatform.value = platformId
}

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} event - Keyboard event
 * @param {number} index - Current button index
 */
function handleKeydown(event, index) {
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      event.preventDefault()
      focusedIndex.value = index > 0 ? index - 1 : PLATFORMS.length - 1
      break
    case 'ArrowRight':
    case 'ArrowDown':
      event.preventDefault()
      focusedIndex.value = index < PLATFORMS.length - 1 ? index + 1 : 0
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      selectPlatform(PLATFORMS[index].id)
      break
  }
}
</script>

<template>
  <div class="platform-select">
    <button
      v-for="(platform, index) in PLATFORMS"
      :key="platform.id"
      :class="[
        'platform-button',
        { 'platform-button--active': selectedPlatform === platform.id }
      ]"
      :aria-label="`Select ${platform.name}`"
      :aria-pressed="selectedPlatform === platform.id"
      :tabindex="focusedIndex === index ? 0 : -1"
      @click="selectPlatform(platform.id)"
      @keydown="handleKeydown($event, index)"
    >
      <span
        class="platform-button__icon"
        v-html="getPlatformIcon(platform.id)"
      ></span>
      <span class="platform-button__name">{{ platform.name }}</span>
    </button>
  </div>
</template>

<style scoped>
.platform-select {
  display: flex;
  gap: var(--spacing-sm);
}

.platform-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.875rem;
  font-weight: 500;
  background-color: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 42px;
}

.platform-button:hover {
  background-color: var(--border-light);
  border-color: var(--border-light);
}

.platform-button:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

.platform-button--active {
  background-color: var(--accent-primary);
  border-color: var(--accent-primary);
  color: var(--text-primary);
}

.platform-button--active:hover {
  background-color: var(--accent-primary-hover);
  border-color: var(--accent-primary-hover);
}

.platform-button__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.platform-button__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.platform-button__name {
  line-height: 1;
}
</style>
