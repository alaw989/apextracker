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
 * Despite advertising Access-Control-Allow-Origin: * on some responses, the
 * API's Cloudflare WAF reliably blocks real browser fetch() requests with a
 * 406 and no CORS header (confirmed via live testing). Server-side requests
 * work fine, so dev routes through Vite's proxy (see vite.config.js) -
 * production will need an equivalent server-side proxy before this can be
 * deployed for real users.
 */
export const API_CONFIG = {
  // API key for apexlegendsapi.com - set VITE_APEX_API_KEY in .env.local
  API_KEY: import.meta.env.VITE_APEX_API_KEY,

  BASE_URL: import.meta.env?.DEV
    ? '/api/bridge'
    : 'https://api.mozambiquehe.re/bridge'
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
