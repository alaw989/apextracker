/**
 * Platform constants for Apex Tracker
 *
 * API v2 uses string slugs (origin, xbl, psn) instead of numeric codes.
 * The old React app used numbers (1, 2, 5) - this is updated to v2 slugs.
 */

/**
 * Platform mappings
 * Maps UI-friendly names to API slugs and icon identifiers
 */
export const PLATFORMS = [
  { id: 'origin', name: 'PC', icon: 'pc' },
  { id: 'xbl', name: 'Xbox', icon: 'xbox' },
  { id: 'psn', name: 'PlayStation', icon: 'psn' }
];

/**
 * API Configuration
 * Contains all settings for Tracker.gg API integration
 */
export const API_CONFIG = {
  // API key for Tracker.gg (existing key from React app)
  API_KEY: '05e6eb8f-3e95-4fbb-a2b5-b0f4dbb124c9',

  // Base URL for Apex Legends API v2
  // During development, use Vite's proxy to bypass CORS
  BASE_URL: import.meta.env?.DEV
    ? '/api/v2/apex/standard/profile'
    : 'https://public-api.tracker.gg/v2/apex/standard/profile',

  // Legacy proxy URL (kept for reference, migrating to DigitalOcean)
  PROXY_URL: import.meta.env?.VITE_PROXY_URL || 'https://fathomless-mesa-94824.herokuapp.com/'
};

/**
 * Error messages for user-facing error handling
 */
export const ERROR_MESSAGES = {
  PLAYER_NOT_FOUND: 'Player not found. Please check the username and platform.',
  NETWORK_ERROR: 'Network error. Please try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment.',
  GENERIC_ERROR: 'An error occurred. Please try again.'
};

/**
 * Helper to get platform by ID
 * @param {string} platformId - The platform ID (origin, xbl, psn)
 * @returns {Object|undefined} The platform object or undefined if not found
 */
export function getPlatformById(platformId) {
  return PLATFORMS.find(p => p.id === platformId);
}

/**
 * Helper to get all platform IDs
 * @returns {string[]} Array of platform IDs
 */
export function getPlatformIds() {
  return PLATFORMS.map(p => p.id);
}
