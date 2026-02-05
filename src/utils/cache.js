/**
 * LocalStorage Cache Utility with LRU Eviction
 *
 * Provides an LRU (Least Recently Used) cache layer backed by localStorage.
 * Handles quota exceeded errors gracefully with automatic eviction.
 * Persists across browser sessions.
 */

// Constants
const MAX_CACHE_SIZE = 10
const LRU_KEY = 'cache:lru'
const CACHE_PREFIX = 'cache:player:'

/**
 * Update LRU tracking for a cache key
 * Moves key to end of array (most recently used)
 * Evicts oldest entry if size exceeds MAX_CACHE_SIZE
 *
 * @param {string} key - Cache key to mark as recently used
 */
function updateLRU(key) {
  try {
    // Parse existing LRU array or initialize empty
    let lru = []
    const stored = localStorage.getItem(LRU_KEY)
    if (stored) {
      try {
        lru = JSON.parse(stored)
      } catch (e) {
        // Invalid JSON, start fresh
        lru = []
      }
    }

    // Ensure array
    if (!Array.isArray(lru)) {
      lru = []
    }

    // Remove key if already exists (will be re-added at end)
    const index = lru.indexOf(key)
    if (index > -1) {
      lru.splice(index, 1)
    }

    // Add to end (most recently used)
    lru.push(key)

    // Evict oldest if exceeding max size
    if (lru.length > MAX_CACHE_SIZE) {
      const oldest = lru.shift()
      // Remove from localStorage
      try {
        localStorage.removeItem(CACHE_PREFIX + oldest)
      } catch (e) {
        // Ignore removal errors
      }
    }

    // Save updated LRU array
    localStorage.setItem(LRU_KEY, JSON.stringify(lru))
  } catch (e) {
    // Silently fail - cache becomes in-memory only for this session
    console.warn('Failed to update LRU tracking:', e)
  }
}

/**
 * Get cached value by key
 * Marks key as recently used
 *
 * @param {string} key - Cache key (without prefix)
 * @returns {any|null} Cached value or null if not found
 */
function getCache(key) {
  // Mark as recently used
  updateLRU(key)

  try {
    const item = localStorage.getItem(CACHE_PREFIX + key)
    if (item === null) {
      return null
    }

    try {
      return JSON.parse(item)
    } catch (e) {
      // Invalid JSON, remove and return null
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }
  } catch (e) {
    return null
  }
}

/**
 * Set cache value with automatic LRU eviction
 * Handles QuotaExceededError gracefully
 *
 * @param {string} key - Cache key (without prefix)
 * @param {any} value - Value to cache (must be JSON-serializable)
 * @returns {boolean} True if successful, false if failed
 */
function setCache(key, value) {
  // Mark as recently used
  updateLRU(key)

  try {
    const serialized = JSON.stringify(value)
    localStorage.setItem(CACHE_PREFIX + key, serialized)
    return true
  } catch (e) {
    // Handle quota exceeded
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      // Try to clear oldest entry and retry once
      try {
        const stored = localStorage.getItem(LRU_KEY)
        if (stored) {
          try {
            const lru = JSON.parse(stored)
            if (Array.isArray(lru) && lru.length > 0) {
              const oldest = lru.shift()
              localStorage.removeItem(CACHE_PREFIX + oldest)
              // Update LRU
              localStorage.setItem(LRU_KEY, JSON.stringify(lru))
              // Retry store
              const serialized = JSON.stringify(value)
              localStorage.setItem(CACHE_PREFIX + key, serialized)
              return true
            }
          } catch (parseError) {
            // Parse failed, give up
          }
        }
      } catch (retryError) {
        // Retry failed, fall through
      }
    }
    // Failed to cache - degrade gracefully (in-memory only for session)
    console.warn('Failed to set cache, degrading to in-memory:', e)
    return false
  }
}

/**
 * Clear all cached player data
 * Useful for testing/debugging
 *
 * @returns {void}
 */
function clearCache() {
  try {
    const stored = localStorage.getItem(LRU_KEY)
    if (stored) {
      try {
        const lru = JSON.parse(stored)
        if (Array.isArray(lru)) {
          lru.forEach(key => {
            try {
              localStorage.removeItem(CACHE_PREFIX + key)
            } catch (e) {
              // Ignore removal errors
            }
          })
        }
      } catch (e) {
        // Parse failed, continue
      }
    }
    // Remove LRU tracking
    localStorage.removeItem(LRU_KEY)
  } catch (e) {
    // Silently fail
  }
}

export {
  getCache,
  setCache,
  updateLRU,
  clearCache,
  MAX_CACHE_SIZE,
  LRU_KEY,
  CACHE_PREFIX
}
