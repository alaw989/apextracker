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
   * @param {Object} apiResponse - Raw API response from apexlegendsapi.com
   * @returns {Object} Transformed player data
   */
  function transformApiData(apiResponse) {
    if (!apiResponse || !apiResponse.global) {
      throw new Error('Invalid API response format')
    }

    const { global, legends: legendsData, total } = apiResponse

    // Overview stats - each entry in `total` is a {name, value} pair
    const stats = Object.values(total || {})
      .filter(s => s && typeof s === 'object' && s.name)
      .map(s => ({
        subtitle: s.name,
        stat: s.value ?? 'N/A'
      }))

    // Filter and sort legends by kills (descending), take top 2
    // Requires merge=true on the API request to get per-legend data for
    // every legend, not just the currently-equipped one
    const legends = Object.entries(legendsData?.all || {})
      .map(([name, info]) => {
        const killsTracker = (info.data || []).find(t => t.key === 'kills')
        if (!killsTracker) return null
        return {
          name,
          imageUrl: info.ImgAssets?.icon,
          kills: killsTracker.value
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.kills - a.kills)
      .slice(0, 2)

    // Extract player info
    return {
      name: global.name,
      avatar: global.avatar,
      rankIcon: global.rank?.rankImg || '',
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
