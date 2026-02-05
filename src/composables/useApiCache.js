/**
 * API Cache Composable with Stale-While-Revalidate
 *
 * Provides reactive caching layer for API responses.
 * Shows cached data immediately while fetching fresh data in background.
 * 15-minute freshness window with automatic revalidation.
 */

import { ref, computed } from 'vue'
import { getCache, setCache } from '@/utils/cache.js'

// Constants
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

/**
 * Format timestamp as human-readable time ago string
 *
 * @param {number|null} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted time ago string
 */
export function timeAgo(timestamp) {
  if (!timestamp) return ''

  const now = Date.now()
  const diff = now - timestamp

  // Less than 60 seconds
  if (diff < 60000) {
    return 'Just now'
  }

  // Less than 60 minutes
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) {
    return `${minutes} min ago`
  }

  // Less than 24 hours
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) {
    return `${hours} hr ago`
  }

  // Days or more
  const days = Math.floor(diff / 86400000)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

/**
 * API Cache Composable
 *
 * @param {string|null} cacheKey - Unique key for cache entry (e.g., "origin:playername")
 * @returns {Object} Cache state and methods
 */
export function useApiCache(cacheKey = null) {
  // State
  const cached = ref(null)
  const timestamp = ref(null)
  const isLoading = ref(false)
  const currentCacheKey = ref(cacheKey)

  /**
   * Load data from localStorage cache
   */
  function loadFromCache() {
    if (!currentCacheKey.value) return

    const entry = getCache(currentCacheKey.value)
    if (entry) {
      cached.value = entry.data
      timestamp.value = entry.time
    }
  }

  /**
   * Check if cached data is stale (older than TTL)
   */
  const isStale = computed(() => {
    if (!timestamp.value) return true
    return Date.now() - timestamp.value > CACHE_TTL
  })

  /**
   * Get formatted time ago string
   */
  const age = computed(() => {
    return timeAgo(timestamp.value)
  })

  /**
   * Fetch data with caching (stale-while-revalidate pattern)
   *
   * @param {Function} fetchFn - Async function that fetches fresh data
   * @param {Object} options - Options object
   * @param {boolean} options.forceRefresh - Skip cache, force fresh fetch
   * @returns {Promise<any>} The data (cached or fresh)
   */
  async function fetchWithCache(fetchFn, options = {}) {
    const { forceRefresh = false } = options

    // Load from cache first
    loadFromCache()

    // If we have fresh cached data and not forcing refresh, return immediately
    if (cached.value && !isStale.value && !forceRefresh) {
      return cached.value
    }

    // If we have stale cached data, return it immediately, then fetch fresh
    const staleData = cached.value

    // Start background fetch
    isLoading.value = true

    try {
      const fresh = await fetchFn()

      // Update cache with fresh data
      cached.value = fresh
      timestamp.value = Date.now()

      // Persist to localStorage
      if (currentCacheKey.value) {
        setCache(currentCacheKey.value, {
          data: fresh,
          time: timestamp.value
        })
      }

      isLoading.value = false

      return fresh
    } catch (error) {
      isLoading.value = false

      // If fetch failed but we have stale data, return it
      if (staleData) {
        return staleData
      }

      // Otherwise, rethrow the error
      throw error
    }
  }

  /**
   * Update the cache key for subsequent operations
   *
   * @param {string} newKey - New cache key
   */
  function setCacheKey(newKey) {
    currentCacheKey.value = newKey
  }

  /**
   * Clear current cached data
   */
  function clear() {
    cached.value = null
    timestamp.value = null
  }

  return {
    // State
    cached,
    timestamp,
    isLoading,
    currentCacheKey,

    // Computed
    isStale,
    age,

    // Methods
    fetchWithCache,
    setCacheKey,
    clear,
    loadFromCache
  }
}
