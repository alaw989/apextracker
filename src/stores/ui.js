import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // State
  const isLoading = ref(false)
  const errorMessage = ref(null)

  // Getters
  const hasError = computed(() => errorMessage.value !== null)
  const showLoading = computed(() => isLoading.value === true)

  // Actions
  function setLoading(loading) {
    isLoading.value = loading
  }

  function setError(message) {
    errorMessage.value = message
  }

  function clearError() {
    errorMessage.value = null
  }

  return {
    // State
    isLoading,
    errorMessage,
    // Getters
    hasError,
    showLoading,
    // Actions
    setLoading,
    setError,
    clearError
  }
})
