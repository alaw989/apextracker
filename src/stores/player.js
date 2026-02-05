/**
 * Player Data Store
 *
 * Manages player stats data, loading states, and errors.
 * Uses Pinia setup store syntax with Composition API.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchPlayerStats } from '@/utils/api.js'

export const usePlayerStore = defineStore('player', () => {
  // State
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Per-operation loading state for search specifically
  const searchLoading = ref(false)

  // Getters
  const hasError = computed(() => error.value !== null)
  const hasData = computed(() => data.value !== null)
  const isLoading = computed(() => loading.value || searchLoading.value)

  /**
   * Transform raw API response into app-friendly format
   * @param {Object} apiResponse - Raw API response from Tracker.gg
   * @returns {Object} Transformed player data
   */
  function transformApiData(apiResponse) {
    if (!apiResponse || !apiResponse.data) {
      throw new Error('Invalid API response format')
    }

    const segments = apiResponse.data.segments
    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      throw new Error('No segments in API response')
    }

    const overview = segments[0]

    // Transform overview stats
    // Loop through stats, filter for objects with displayName
    const stats = []
    for (const prop in overview.stats) {
      const stat = overview.stats[prop]
      if (typeof stat === 'object' && stat.displayName) {
        stats.push({
          subtitle: stat.displayName,
          stat: stat.displayValue || stat.value || stat.rankScore?.displayValue || 'N/A'
        })
      }
    }

    // Filter and sort legends by kills (descending), take top 2
    const legendSegments = segments
      .filter(s => s.type !== 'overview' && s.stats?.kills?.value !== undefined)
      .sort((a, b) => b.stats.kills.value - a.stats.kills.value)
      .slice(0, 2)

    const legends = legendSegments.map(seg => ({
      name: seg.metadata.name,
      imageUrl: seg.metadata.imageUrl,
      kills: seg.stats.kills.displayValue || seg.stats.kills.value
    }))

    // Extract player info
    return {
      name: apiResponse.data.platformInfo.platformUserHandle,
      avatar: apiResponse.data.platformInfo.avatarUrl,
      rankIcon: overview.stats?.rankScore?.metadata?.iconUrl || '',
      stats,
      legends
    }
  }

  /**
   * Fetch player data from API
   * @param {string} username - Player username
   * @param {string} platform - Platform slug (origin, xbl, psn)
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async function fetchPlayer(username, platform) {
    loading.value = true
    error.value = null

    try {
      const response = await fetchPlayerStats(username, platform)
      data.value = transformApiData(response)
      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch player data'
      data.value = null
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Search for player - separate action for search-specific loading
   * @param {string} username - Player username
   * @param {string} platform - Platform slug (origin, xbl, psn)
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async function searchPlayer(username, platform) {
    searchLoading.value = true
    error.value = null

    try {
      const response = await fetchPlayerStats(username, platform)
      data.value = transformApiData(response)
      return { success: true }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search for player'
      data.value = null
      return { success: false, error: error.value }
    } finally {
      searchLoading.value = false
    }
  }

  /**
   * Clear player data
   */
  function clearPlayer() {
    data.value = null
    error.value = null
  }

  /**
   * Clear error state
   */
  function clearError() {
    error.value = null
  }

  return {
    // State
    data,
    loading,
    searchLoading,
    error,

    // Getters
    hasError,
    hasData,
    isLoading,

    // Actions
    fetchPlayer,
    searchPlayer,
    clearPlayer,
    clearError
  }
})
