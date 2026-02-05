import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  // State
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const hasError = computed(() => error.value !== null)

  // Actions
  async function fetchPlayer(username, platform) {
    // Skeleton implementation - full API integration in plan 01-04
    loading.value = true
    error.value = null

    try {
      // TODO: Implement actual API call in plan 01-04
      // const response = await fetch(`${PROXY_URL}/https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${username}`)
      // const result = await response.json()
      // data.value = transformApiData(result)

      // Placeholder for now
      console.log('fetchPlayer called with:', username, platform)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch player data'
    } finally {
      loading.value = false
    }
  }

  function clearPlayer() {
    data.value = null
    error.value = null
  }

  return {
    // State
    data,
    loading,
    error,
    // Getters
    hasError,
    // Actions
    fetchPlayer,
    clearPlayer
  }
})
