<script setup>
/**
 * BaseInput - Reusable input component
 *
 * @props {string} modelValue - Input value (v-model)
 * @props {string} placeholder - Placeholder text
 * @props {string} type - Input type: 'text' | 'email' | 'password' | 'search'
 * @props {string} id - Input ID
 * @emits update:modelValue - Emitted when input value changes
 */

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'email', 'password', 'search', 'url'].includes(value)
  },
  id: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

function handleInput(e) {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <div class="base-input">
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="base-input__field"
      @input="handleInput"
    />
  </div>
</template>

<style scoped>
.base-input {
  display: flex;
  width: 100%;
}

.base-input__field {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 1rem;
  background-color: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.base-input__field::placeholder {
  color: var(--text-muted);
}

.base-input__field:hover {
  border-color: var(--border-light);
}

.base-input__field:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(60, 135, 114, 0.2);
}

.base-input__field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
