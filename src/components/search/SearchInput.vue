<script setup>
/**
 * SearchInput - Username input field for player search
 *
 * Text input component that emits submit event when Enter key is pressed.
 * Uses v-model pattern for two-way binding with focus state styling.
 *
 * @props {string} modelValue - Input value (v-model)
 * @props {string} placeholder - Placeholder text
 * @emits update:modelValue - Emitted when input value changes
 * @emits submit - Emitted when user presses Enter
 * @emits focus - Emitted when input gains focus
 * @emits blur - Emitted when input loses focus
 */

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Apex Username'
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'focus', 'blur'])

/**
 * Handle input value change
 * @param {InputEvent} event - Input event
 */
function handleInput(event) {
  emit('update:modelValue', event.target.value)
}

/**
 * Handle Enter key press
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeydown(event) {
  if (event.key === 'Enter') {
    emit('submit')
  }
}

/**
 * Handle focus event
 * @param {FocusEvent} event - Focus event
 */
function handleFocus(event) {
  emit('focus', event)
}

/**
 * Handle blur event
 * @param {FocusEvent} event - Blur event
 */
function handleBlur(event) {
  emit('blur', event)
}
</script>

<template>
  <div class="search-input">
    <input
      :value="modelValue"
      :placeholder="placeholder"
      type="text"
      class="search-input__field"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="handleFocus"
      @blur="handleBlur"
      autocomplete="off"
      autocapitalize="off"
      spellcheck="false"
    />
  </div>
</template>

<style scoped>
.search-input {
  display: flex;
  width: 100%;
}

.search-input__field {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 1rem;
  font-weight: 500;
  background-color: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  min-height: 42px;
}

.search-input__field::placeholder {
  color: var(--text-muted);
}

.search-input__field:hover {
  border-color: var(--border-light);
}

.search-input__field:focus {
  outline: none;
  border-color: var(--accent-primary);
  background-color: var(--bg-darker);
  box-shadow: 0 0 0 2px rgba(60, 135, 114, 0.2);
}

.search-input__field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
