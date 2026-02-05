<script setup>
/**
 * BaseCard - Reusable card component
 *
 * @props {string} variant - Card style variant: 'default' | 'elevated' | 'outlined'
 * @slots default - Main card content
 * @slots header - Card header content
 * @slots footer - Card footer content
 */

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'elevated', 'outlined'].includes(value)
  }
})
</script>

<template>
  <div :class="['base-card', `base-card--${variant}`]">
    <div v-if="$slots.header" class="base-card__header">
      <slot name="header" />
    </div>
    <div class="base-card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.base-card {
  background-color: var(--bg-dark);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.base-card--default {
  background-color: var(--bg-dark);
  border: 1px solid var(--border);
}

.base-card--elevated {
  background-color: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
}

.base-card--outlined {
  background-color: transparent;
  border: 2px solid var(--border);
}

.base-card__header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border);
}

.base-card__header:last-child {
  border-bottom: none;
}

.base-card__body {
  padding: var(--spacing-lg);
}

.base-card__body:only-child {
  padding: var(--spacing-lg);
}

.base-card__footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border);
}

.base-card__footer:first-child {
  border-top: none;
}
</style>
