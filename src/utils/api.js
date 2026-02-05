/**
 * API Fetch Utilities
 *
 * Handles all communication with the Tracker.gg API via proxy.
 * Provides error handling and response validation.
 */

import { API_CONFIG, ERROR_MESSAGES } from './constants.js'

/**
 * Fetch player stats from Tracker.gg API
 *
 * @param {string} username - Player username to search
 * @param {string} platform - Platform slug (origin, xbl, psn)
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

  const validPlatforms = ['origin', 'xbl', 'psn']
  if (!validPlatforms.includes(platform)) {
    throw new Error(ERROR_MESSAGES.GENERIC_ERROR)
  }

  // Trim username for API call
  const cleanUsername = username.trim()

  // Construct URL: BASE_URL + /platform/username
  // In development, uses Vite proxy (/api prefix)
  // In production, uses direct URL (requires CORS proxy on backend)
  const url = `${API_CONFIG.BASE_URL}/${platform}/${cleanUsername}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'TRN-Api-Key': API_CONFIG.API_KEY,
        'Accept': 'application/json'
      }
    })

    // Handle specific HTTP status codes
    if (response.status === 404) {
      throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND)
    }

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

    // Validate response structure
    if (!data || !data.data) {
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
