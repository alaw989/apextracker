import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export const useSearchStore = defineStore('search', () => {
  // State - persisted to localStorage using VueUse
  const history = useLocalStorage('apex-search-history', [])

  // Max items to keep in history
  const MAX_HISTORY = 10

  // Actions
  function addToHistory(username, platform) {
    const item = {
      username,
      platform,
      timestamp: Date.now()
    }

    // Remove duplicates of the same search
    const filtered = history.value.filter(
      h => h.username !== username || h.platform !== platform
    )

    // Add new item to front, limit to MAX_HISTORY
    history.value = [item, ...filtered].slice(0, MAX_HISTORY)
  }

  function clearHistory() {
    history.value = []
  }

  function removeFromHistory(index) {
    history.value.splice(index, 1)
  }

  // Getters
  const hasHistory = () => history.value.length > 0

  return {
    // State
    history,
    // Actions
    addToHistory,
    clearHistory,
    removeFromHistory,
    hasHistory
  }
})
