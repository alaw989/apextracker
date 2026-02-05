/**
 * Player Data Store
 *
 * Manages player stats data, loading states, and errors.
 * Uses Pinia setup store syntax with Composition API.
 * Integrates API caching with stale-while-revalidate pattern.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchPlayerStats } from '@/utils/api.js'
import { useApiCache } from '@/composables/useApiCache.js'

export const usePlayerStore = defineStore('player', () => {
  // State
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Per-operation loading state for search specifically
  const searchLoading = ref(false)

  // Cache state
  const cacheTimestamp = ref(null)
  const isRefreshing = ref(false)

  // API cache composable
  const apiCache = useApiCache(null)

  // Getters
  const hasError = computed(() => error.value !== null)
  const hasData = computed(() => data.value !== null)
  const isLoading = computed(() => loading.value || searchLoading.value)

  // Cache-related getters
  const cacheAge = computed(() => {
    if (!cacheTimestamp.value) return ''
    const now = Date.now()
    const diff = now - cacheTimestamp.value

    if (diff < 60000) return 'Just now'
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes} min ago`
    const hours = Math.floor(diff / 3600000)
    if (hours < 24) return `${hours} hr ago`
    const days = Math.floor(diff / 86400000)
    return `${days} day${days > 1 ? 's' : ''} ago`
  })

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
   * Fetch player data from API with caching
   * @param {string} username - Player username
   * @param {string} platform - Platform slug (origin, xbl, psn)
   * @param {Object} options - Options object
   * @param {boolean} options.forceRefresh - Skip cache and force fresh fetch
   * @returns {Promise<{success: boolean, error?: string, fromCache?: boolean}>}
   */
  async function fetchPlayer(username, platform, options = {}) {
    loading.value = true
    error.value = null

    const cacheKey = `${platform}:${username}`
    apiCache.setCacheKey(cacheKey)

    try {
      // Fetch with cache support
      const response = await apiCache.fetchWithCache(
        () => fetchPlayerStats(username, platform),
        options
      )

      data.value = transformApiData(response)
      cacheTimestamp.value = apiCache.timestamp.value
      return { success: true, fromCache: false }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch player data'
      data.value = null
      cacheTimestamp.value = null
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Search for player - separate action for search-specific loading
   * Uses stale-while-revalidate: returns cached data immediately if available
   * @param {string} username - Player username
   * @param {string} platform - Platform slug (origin, xbl, psn)
   * @returns {Promise<{success: boolean, error?: string, fromCache?: boolean}>}
   */
  async function searchPlayer(username, platform) {
    searchLoading.value = true
    error.value = null

    const cacheKey = `${platform}:${username}`
    apiCache.setCacheKey(cacheKey)

    try {
      // First check if we have cached data to show immediately
      apiCache.loadFromCache()

      const fromCache = apiCache.cached.value !== null

      if (fromCache) {
        // Show cached data immediately
        data.value = transformApiData(apiCache.cached.value)
        cacheTimestamp.value = apiCache.timestamp.value
        searchLoading.value = false

        // Fetch fresh data in background (fire and forget)
        fetchPlayerStats(username, platform)
          .then(freshResponse => {
            data.value = transformApiData(freshResponse)
            cacheTimestamp.value = Date.now()
            // Update cache
            apiCache.cached.value = freshResponse
            apiCache.timestamp.value = cacheTimestamp.value
            apiCache.setCache(cacheKey, {
              data: freshResponse,
              time: cacheTimestamp.value
            })
          })
          .catch(() => {
            // Silently fail - user still sees cached data
          })

        return { success: true, fromCache: true }
      }

      // No cache, fetch normally
      const response = await fetchPlayerStats(username, platform)
      data.value = transformApiData(response)
      cacheTimestamp.value = Date.now()
      apiCache.cached.value = response
      apiCache.timestamp.value = cacheTimestamp.value
      apiCache.setCache(cacheKey, {
        data: response,
        time: cacheTimestamp.value
      })
      return { success: true, fromCache: false }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search for player'
      data.value = null
      cacheTimestamp.value = null
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

  /**
   * Force refresh player data, bypassing cache
   * @param {string} username - Player username
   * @param {string} platform - Platform slug (origin, xbl, psn)
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async function forceRefresh(username, platform) {
    isRefreshing.value = true
    const result = await fetchPlayer(username, platform, { forceRefresh: true })
    isRefreshing.value = false
    return result
  }

  return {
    // State
    data,
    loading,
    searchLoading,
    error,
    cacheTimestamp,
    isRefreshing,

    // Getters
    hasError,
    hasData,
    isLoading,
    cacheAge,

    // Actions
    fetchPlayer,
    searchPlayer,
    clearPlayer,
    clearError,
    forceRefresh
  }
})
