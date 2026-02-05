/**
 * Background image utilities for Apex Legends legends
 *
 * Maps legend names to their background image paths in the public directory.
 * Used for dynamic hero backgrounds based on player's favorite legend.
 */

/**
 * Legend name to filename mapping
 * Handles case variations and standardized filenames
 */
const LEGEND_BACKGROUNDS = {
  'pathfinder': 'pathfinder.jpg',
  'bangalore': 'bangalore.png',
  'bloodhound': 'bloodhound.png',
  'caustic': 'caustic.png',
  'gibraltar': 'gibraltar.png',
  'lifeline': 'lifeline.png',
  'mirage': 'mirage.png',
  'wattson': 'wattson.png',
  'wraith': 'wraith.png',
  'octane': 'octane.png',
  'crypto': 'crypto.png'
}

/**
 * Default background path for unknown legends
 */
const DEFAULT_BACKGROUND = '/backgrounds/default.jpg'

/**
 * Get the background image path for a legend
 *
 * @param {string} legendName - The name of the legend (case-insensitive)
 * @returns {string} The path to the background image, or default if not found
 *
 * @example
 * getBackgroundForLegend('Pathfinder') // returns '/backgrounds/pathfinder.jpg'
 * getBackgroundForLegend('BANGALORE') // returns '/backgrounds/bangalore.png'
 * getBackgroundForLegend('Unknown') // returns '/backgrounds/default.jpg'
 */
export function getBackgroundForLegend(legendName) {
  if (!legendName || typeof legendName !== 'string') {
    return DEFAULT_BACKGROUND
  }

  const key = legendName.toLowerCase().trim()
  const filename = LEGEND_BACKGROUNDS[key]

  return filename ? `/backgrounds/${filename}` : DEFAULT_BACKGROUND
}

/**
 * Check if a legend has a custom background
 *
 * @param {string} legendName - The name of the legend (case-insensitive)
 * @returns {boolean} True if the legend has a custom background
 */
export function hasBackground(legendName) {
  if (!legendName || typeof legendName !== 'string') {
    return false
  }

  const key = legendName.toLowerCase().trim()
  return LEGEND_BACKGROUNDS.hasOwnProperty(key)
}

/**
 * Get all available legend names
 *
 * @returns {string[]} Array of legend names that have backgrounds
 */
export function getAvailableLegends() {
  return Object.keys(LEGEND_BACKGROUNDS)
}
