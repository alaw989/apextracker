/**
 * API Fetch Utilities
 *
 * Handles all communication with the apexlegendsapi.com (mozambiquehe.re) API.
 * Provides error handling and response validation.
 */

import { API_CONFIG, ERROR_MESSAGES, getPlatformIds } from './constants.js'

/**
 * Fetch player stats from apexlegendsapi.com
 *
 * @param {string} username - Player username to search
 * @param {string} platform - Platform slug (PC, X1, PS4, SWITCH)
 * @returns {Promise<Object>} Parsed JSON response from API
 * @throws {Error} With descriptive message for various error conditions
 */
export async function fetchPlayerStats(username, platform) {
  // Input validation
  if (!username || typeof username !== 'string' || username.trim() === '') {
    throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND)
  }

  if (!platform || typeof platform !== 'string') {
    throw new Error(ERROR_MESSAGES.GENERIC_ERROR)
  }

  const validPlatforms = getPlatformIds()
  if (!validPlatforms.includes(platform)) {
    throw new Error(ERROR_MESSAGES.GENERIC_ERROR)
  }

  // Trim username for API call
  const cleanUsername = username.trim()

  // merge=true is required to get per-legend kill trackers for every legend
  // (without it, only the currently-equipped legend has stat data)
  const url = `${API_CONFIG.BASE_URL}?player=${encodeURIComponent(cleanUsername)}&platform=${platform}&auth=${API_CONFIG.API_KEY}&merge=true`

  try {
    // No Accept header - this API's server uses Apache content negotiation
    // (mod_negotiation) and returns 406 Not Acceptable for
    // "Accept: application/json" specifically, even though it always
    // responds with JSON regardless of what Accept value is sent.
    const response = await fetch(url, { method: 'GET' })

    // Handle specific HTTP status codes
    if (response.status === 404) {
      throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND)
    }

    // Known upstream quirk: this API sometimes returns 200 instead of 429
    // when rate-limited - the data.Error check below catches that case too
    if (response.status === 429) {
      throw new Error(ERROR_MESSAGES.RATE_LIMIT)
    }

    if (response.status === 403) {
      throw new Error(ERROR_MESSAGES.GENERIC_ERROR)
    }

    if (!response.ok) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }

    const data = await response.json()

    // This API reports errors (e.g. player not found) as a 200 response
    // with an "Error" field rather than a non-2xx status code
    if (!data || data.Error) {
      throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND)
    }

    if (!data.global) {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }

    return data
  } catch (error) {
    // Re-throw known errors
    if (error.message && (
      error.message.includes(ERROR_MESSAGES.PLAYER_NOT_FOUND) ||
      error.message.includes(ERROR_MESSAGES.RATE_LIMIT) ||
      error.message.includes(ERROR_MESSAGES.NETWORK_ERROR) ||
      error.message.includes(ERROR_MESSAGES.GENERIC_ERROR)
    )) {
      throw error
    }

    // Catch network errors (no internet, DNS failure, etc.)
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
  }
}
