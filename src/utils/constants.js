/**
 * Platform constants for Apex Tracker
 *
 * apexlegendsapi.com (mozambiquehe.re) uses PC/X1/PS4/SWITCH platform slugs.
 */

/**
 * Platform mappings
 * Maps UI-friendly names to API slugs and icon identifiers
 */
export const PLATFORMS = [
  { id: 'PC', name: 'PC', icon: 'pc' },
  { id: 'X1', name: 'Xbox', icon: 'xbox' },
  { id: 'PS4', name: 'PlayStation', icon: 'psn' },
  { id: 'SWITCH', name: 'Switch', icon: 'switch' }
];

/**
 * API Configuration
 * Contains all settings for apexlegendsapi.com (mozambiquehe.re) integration.
 *
 * Supports CORS directly (Access-Control-Allow-Origin: *), so no dev/prod
 * proxy is needed - the browser can call BASE_URL directly in both modes.
 * (An earlier "Accept: application/json" header caused the server's Apache
 * content negotiation to reject requests with 406 - fixed in api.js, not
 * a CORS issue at all despite how the browser reported it.)
 */
export const API_CONFIG = {
  // API key for apexlegendsapi.com - set VITE_APEX_API_KEY in .env.local
  API_KEY: import.meta.env.VITE_APEX_API_KEY,

  BASE_URL: 'https://api.mozambiquehe.re/bridge'
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
